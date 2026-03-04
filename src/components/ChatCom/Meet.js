// import React, { useEffect } from "react";
// import { StyleSheet, View } from "react-native";
// import { WebView } from "react-native-webview";

// const JitsiMeetWebView = ({ roomName }) => {
//   const htmlContent = `
//         <html>
//         <head>
//             <script src="https://meet.bootcampshub.ai/external_api.js"></script>
//             <style>
//                 body, html { height: 100%; margin: 0; overflow: hidden; }
//                 #meet { height: 100%; width: 100%; }
//             </style>
//         </head>
//         <body>
//             <div id="meet"></div>
//             <script>
//                 document.addEventListener("DOMContentLoaded", function() {
//                     const api = new JitsiMeetExternalAPI("meet.schoolshub.ai", {
//                         roomName: "${roomName}",
//                         width: '100%',
//                         height: '100%',
//                         parentNode: document.getElementById('meet')
//                     });

//                     api.addEventListener('videoConferenceJoined', () => {
//                         window.ReactNativeWebView.postMessage("Joined");
//                     });

//                     api.addEventListener('videoConferenceLeft', () => {
//                         window.ReactNativeWebView.postMessage("Left");
//                     });

//                     api.addEventListener('readyToClose', () => {
//                         window.ReactNativeWebView.postMessage("CLOSE");
//                     });
//                 });
//             </script>
//         </body>
//         </html>
//     `;

//   return (
//     <View style={styles.container}>
//       <WebView
//         allowsInlineMediaPlayback
//         allowsFullscreenVideo
//         allowUniversalAccessFromFileURLs
//         style={{ flex: 1 }}
//         originWhitelist={["*"]}
//         source={{ html: htmlContent }}
//         javaScriptEnabled={true}
//         domStorageEnabled={true}
//         mediaPlaybackRequiresUserAction={false}
//         onMessage={(event) => {
//           console.log("Message from Jitsi:", event.nativeEvent.data);
//         }}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
// });

// export default JitsiMeetWebView;
