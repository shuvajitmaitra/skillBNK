import React from 'react';
import {StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';

export default function VideoPlayer({url}: {url: string}) {
  const injectedJavaScript = `
  const iframe = document.querySelector('iframe');
  const player = new Vimeo.Player(iframe);

  player.on('play', function() {
    iframe.requestFullscreen();
  });
`;
  return (
    <View style={styles.videoContainer}>
      {/* <WebView
        source={{uri: url}}
        allowsFullscreenVideo={true} // Enables fullscreen mode for videos
        scrollEnabled={false}
        javaScriptEnabled={true} // Ensures JavaScript is enabled for video controls
        domStorageEnabled={true} // Enables DOM storage for video playback
        mediaPlaybackRequiresUserAction={false}
      /> */}
      <WebView
        source={{
          html: `<iframe src=${
            url || 'https://placehold.co/1920x1080.mp4?text=No+Video+Available'
          } width="100%" height="100%" frameborder="0" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>`,
        }}
        onError={() => null}
        allowsFullscreenVideo={true}
        scrollEnabled={false}
        injectedJavaScript={injectedJavaScript}
        automaticallyAdjustContentInsets={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    aspectRatio: 16 / 9, // Ensures a 16:9 aspect ratio for the video
    // marginHorizontal: responsiveScreenWidth(4), // Adds horizontal margin for responsive screens
    borderRadius: 10, // Rounds the corners of the container
    overflow: 'hidden', // Ensures content doesn't spill out of the container
    borderWidth: 1,
    borderColor: 'gray', // Sets border color
  },
});
