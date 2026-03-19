import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

type PlayerState =
  | 'playing'
  | 'paused'
  | 'ended'
  | 'buffering'
  | 'unstarted'
  | 'error';

type Props = {
  url: string; // embed/watch/youtu.be
  startAt: number; // seconds

  onStateChange?: (state: PlayerState, payload?: any) => void;
  onDuration?: (durationSec: number) => void;

  onEvery15Sec?: (payload: {currentTime: number; duration: number}) => void;
  onFiveSecBeforeEnd?: (payload: {
    currentTime: number;
    duration: number;
  }) => void;
};

function extractVideoId(url: string) {
  const u = (url || '').trim();
  const m1 = u.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/);
  if (m1?.[1]) return m1[1];

  const m2 = u.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
  if (m2?.[1]) return m2[1];

  const m3 = u.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  if (m3?.[1]) return m3[1];

  return '';
}

const YouTubePlayer = ({
  url,
  startAt,
  onStateChange,
  onDuration,
  onEvery15Sec,
  onFiveSecBeforeEnd,
}: Props) => {
  const playerRef = useRef<any>(null);

  const [duration, setDuration] = useState<number>(0);

  // trackers
  const last15BucketRef = useRef<number>(-1);
  const fiveSecCalledRef = useRef<boolean>(false);
  const timerRef = useRef<any>(null);

  const videoId = useMemo(() => extractVideoId(url), [url]);

  const clearPoll = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startPoll = useCallback(() => {
    if (timerRef.current) return;

    timerRef.current = setInterval(async () => {
      try {
        const t = Number(await playerRef.current?.getCurrentTime?.()) || 0;
        const d =
          duration || Number(await playerRef.current?.getDuration?.()) || 0;

        if (!duration && d > 0) {
          setDuration(d);
          onDuration?.(d);
        }

        // 1) every 15 sec
        const bucket = Math.floor(t / 15);
        if (bucket !== last15BucketRef.current) {
          last15BucketRef.current = bucket;

          // skip initial bucket (<15s)
          if (t >= 15 && d > 0) {
            onEvery15Sec?.({currentTime: t, duration: d});
          }
        }

        // 2) five seconds before end (once)
        if (!fiveSecCalledRef.current && d > 0) {
          const remaining = d - t;
          if (remaining <= 5 && remaining > 0) {
            fiveSecCalledRef.current = true;
            onFiveSecBeforeEnd?.({currentTime: t, duration: d});
          }
        }
      } catch (e) {
        console.log('e', JSON.stringify(e, null, 2));
        // ignore polling errors
      }
    }, 1000); // 1s polling
  }, [duration, onDuration, onEvery15Sec, onFiveSecBeforeEnd]);

  const onReady = useCallback(async () => {
    // duration fetch early
    try {
      const d = Number(await playerRef.current?.getDuration?.()) || 0;
      if (d > 0) {
        setDuration(d);
        onDuration?.(d);
      }
    } catch {}

    // seek startAt
    if (startAt != null && startAt > 0) {
      playerRef.current?.seekTo(startAt, true);
      // trackers reset for new starting point
      last15BucketRef.current = Math.floor(startAt / 15);
      fiveSecCalledRef.current = false;
    }
  }, [startAt, onDuration]);

  const handleStateChange = useCallback(
    (state: string) => {
      // youtube-iframe states: "unstarted" | "ended" | "playing" | "paused" | "buffering" | "cued"
      const s = state as PlayerState;

      onStateChange?.(s);

      if (s === 'playing') {
        startPoll();
      } else if (
        s === 'paused' ||
        s === 'ended' ||
        s === 'unstarted' ||
        s === 'error'
      ) {
        clearPoll();

        if (s === 'ended') {
          // ended হলে trackers reset (next play এর জন্য)
          fiveSecCalledRef.current = false;
          last15BucketRef.current = -1;
        }
      }
    },
    [onStateChange, startPoll, clearPoll],
  );

  // video change হলে trackers reset
  useEffect(() => {
    fiveSecCalledRef.current = false;
    last15BucketRef.current = -1;
    setDuration(0);
    clearPoll();
  }, [videoId, clearPoll]);

  // unmount cleanup
  useEffect(() => {
    return () => {
      clearPoll();
    };
  }, [clearPoll]);

  return (
    <View style={{aspectRatio: 16 / 9, backgroundColor: 'black'}}>
      <YoutubePlayer
        ref={playerRef}
        height={220}
        play={true}
        videoId={videoId}
        onReady={onReady}
        onChangeState={handleStateChange}
        forceAndroidAutoplay
        initialPlayerParams={{
          controls: true,
          rel: false,
          // start param you can also set, but we already seekTo when ready
          // start: startAt,
        }}
      />
    </View>
  );
};

export default YouTubePlayer;
