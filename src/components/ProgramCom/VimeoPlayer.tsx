import React, {useMemo, useCallback, useRef} from 'react';
import {View} from 'react-native';
import {WebView} from 'react-native-webview';

type Props = {
  url: string;
  startAt: number;

  // NEW callbacks
  onEvery15Sec?: (payload: {currentTime: number; duration: number}) => void;
  onFiveSecBeforeEnd?: (payload: {
    currentTime: number;
    duration: number;
  }) => void;

  // optional existing callbacks
  onStateChange?: (
    state: 'playing' | 'paused' | 'ended' | 'error',
    payload?: any,
  ) => void;
  onDuration?: (durationSec: number) => void;
};

const VimeoPlayer = ({
  url,
  startAt,
  onEvery15Sec,
  onFiveSecBeforeEnd,
  onStateChange,
  onDuration,
}: Props) => {
  const webRef = useRef<WebView>(null);

  function cleanUrl(u: string): string {
    return (u || '').replace(/[\t ]+$/, '').trim();
  }

  const baseUrl = useMemo(() => {
    const u = cleanUrl(url);
    const joiner = u.includes('?') ? '&' : '?';
    return (
      u +
      joiner +
      'auto=0&muted=0&playsinline=1&controls=1&title=0&byline=0&portrait=0'
    );
  }, [url]);

  const html = useMemo(() => {
    const safeStart = Math.max(0, startAt || 0);

    return `
<!doctype html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://player.vimeo.com/api/player.js"></script>
  <style>
    html, body { margin:0; padding:0; height:100%; background:#000; overflow:hidden; }
    iframe { position:absolute; top:0; left:0; width:100%; height:100%; border:0; }
  </style>
</head>
<body>
  <iframe
    id="vimeo"
    src="${baseUrl}"
    allow="autoplay; fullscreen; picture-in-picture"
    allowfullscreen
  ></iframe>

  <script>
    (function () {
      var START_AT = ${safeStart};
      var iframe = document.getElementById('vimeo');
      var player = new Vimeo.Player(iframe);

      var duration = 0;
      var last15Bucket = -1;         // 15s bucket tracker
      var fiveSecCalled = false;     // call once
      var isPlaying = false;

      function send(type, payload) {
        try {
          window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
            JSON.stringify({ type: type, payload: payload || {} })
          );
        } catch (e) {}
      }

      player.ready()
        .then(function () { return player.getDuration(); })
        .then(function (d) {
          duration = Number(d) || 0;
          send('duration', { duration: duration });

          if (START_AT > 0) return player.setCurrentTime(START_AT);
        })
        // .then(function () { return player.play(); })
        // .then(function () {
        //   isPlaying = true;
        //   send('state', { state: 'playing' });
        // })
        .catch(function (e) {
          send('state', { state: 'error', error: (e && (e.name || e.message)) || String(e) });
        });

      player.on('play', function () {
        isPlaying = true;
        send('state', { state: 'playing' });
      });

      player.on('pause', function () {
        isPlaying = false;
        send('state', { state: 'paused' });
      });

      player.on('ended', function () {
        isPlaying = false;
        send('state', { state: 'ended' });
      });

      // IMPORTANT: timeupdate fires during playback
      player.on('timeupdate', function (data) {
        if (!isPlaying) return;

        var t = Number(data.seconds) || 0;
        var d = duration || Number(data.duration) || 0;
        if (!duration && d) duration = d;

        // 1) Every 15 seconds (15,30,45...) — bucket changes only once
        var bucket = Math.floor(t / 15);
        if (bucket !== last15Bucket) {
          last15Bucket = bucket;

          // optional: skip the very first bucket at t < 15
          if (t >= 15) {
            send('every15', { currentTime: t, duration: duration });
          }
        }

        // 2) 5 seconds before end (call once)
        if (!fiveSecCalled && duration > 0) {
          var remaining = duration - t;
          if (remaining <= 5 && remaining > 0) {
            fiveSecCalled = true;
            send('fiveSecBeforeEnd', { currentTime: t, duration: duration });
          }
        }
      });

    })();
  </script>
</body>
</html>
`;
  }, [baseUrl, startAt]);

  const onMessage = useCallback(
    (event: any) => {
      try {
        const msg = JSON.parse(event.nativeEvent.data);

        if (msg.type === 'duration') {
          const d = Number(msg.payload?.duration);
          if (!Number.isNaN(d)) onDuration?.(d);
        }

        if (msg.type === 'state') {
          onStateChange?.(msg.payload?.state, msg.payload);
        }

        if (msg.type === 'every15') {
          onEvery15Sec?.({
            currentTime: Number(msg.payload?.currentTime) || 0,
            duration: Number(msg.payload?.duration) || 0,
          });
        }

        if (msg.type === 'fiveSecBeforeEnd') {
          onFiveSecBeforeEnd?.({
            currentTime: Number(msg.payload?.currentTime) || 0,
            duration: Number(msg.payload?.duration) || 0,
          });
        }
      } catch (e) {
        // ignore
      }
    },
    [onDuration, onStateChange, onEvery15Sec, onFiveSecBeforeEnd],
  );

  return (
    <View style={{aspectRatio: 16 / 9, marginLeft: 2}}>
      <WebView
        ref={webRef}
        source={{html}}
        allowsFullscreenVideo
        scrollEnabled={false}
        javaScriptEnabled
        domStorageEnabled
        mediaPlaybackRequiresUserAction={false}
        onMessage={onMessage}
      />
    </View>
  );
};

export default VimeoPlayer;
