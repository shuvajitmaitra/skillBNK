import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import YoutubeIframe from 'react-native-youtube-iframe';
import {LinkPreview} from '@flyerhq/react-native-link-preview';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
const extractVideoId = (url: string) => {
  if (url.includes('youtu.be')) {
    return url.split('youtu.be/')[1].split('?')[0];
  } else if (url.includes('youtube.com/live')) {
    return url.split('/')[url.split('/').length - 1].split('?')[0];
  } else if (url.includes('youtube.com/watch')) {
    return url.split('v=')[url.split('v=').length - 1].split('&')[0];
  } else {
    return null;
  }
};

// /* <a target="_blank" href="https://www.facebook.com/share/p/15ri4zBarJ/">https://www.facebook.com/share/p/15ri4zBarJ/</a> */
function extractUrlsFromAnchors(text: string) {
  const urlArray = [];
  // Regex to match <a> tags and capture the href attribute
  const anchorRegex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']+)["'][^>]*?>/gi;
  let match;

  while ((match = anchorRegex.exec(text)) !== null) {
    if (match[1]) {
      urlArray.push(match[1]);
    }
  }

  return urlArray[0];
}
const MessagePreviewContainer = ({text: txt}: {text: string}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  //   const videoUrl =
  //     'https://www.facebook.com/facebook/videos/10153231379946729/';

  //   const {width} = Dimensions.get('window');
  //   const videoWidth = width * 0.95;
  //   const videoHeight = (videoWidth * 9) / 16; // 16:9 aspect ratio

  //   const embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
  //     text,
  //   )}&show_text=0&width=${Math.round(videoWidth)}`;
  const text = extractUrlsFromAnchors(txt);
  if (!text) {
    return null;
  } else if (text.includes('youtube.com') || text.includes('youtu.be')) {
    return <YoutubeIframe videoId={extractVideoId(text) || ''} height={200} />;
    // } else if (text.includes('facebook.com')) {
    //   return (
    //     //   <WebView
    //     //     source={{uri: embedUrl}}
    //     //     style={{flex: 1}}
    //     //     height={200}
    //     //     javaScriptEnabled
    //     //     domStorageEnabled
    //     //     allowsFullscreenVideo
    //     //     startInLoadingState
    //     //     scalesPageToFit
    //     //     mixedContentMode="always"
    //     //   />
    //     <WebView
    //       style={styles.yourStyles}
    //       height={200}
    //       source={{
    //         uri: 'https://www.facebook.com/video/embed?video_id=15ri4zBarJ',
    //       }}
    //     />
    //   );
  } else if (text.includes('meet.google.com')) {
    return (
      <View
        style={[
          styles.previewContainer,
          {paddingVertical: 10, flexDirection: 'row', alignItems: 'center'},
        ]}>
        {/* <WebView
          source={{uri: 'https://meet.google.com/wym-paix-anz'}}
          style={{flex: 1}}
          height={100}
          scrollEnabled={false}
        /> */}
        <Image
          style={{width: '40%', height: 50}}
          source={{
            uri: 'https://t3.ftcdn.net/jpg/06/27/79/72/360_F_627797216_0xEWBmn7dfumO5DE8cNag6RqLUDSkEjv.webp',
          }}
        />
        <View style={styles.meetContainer}>
          <Text style={styles.title}>Meet</Text>
          <Text style={{color: Colors.BodyText}}>{text}</Text>
        </View>
      </View>
    );
  } else {
    return (
      <LinkPreview
        text={text}
        enableAnimation={true}
        renderLinkPreview={({previewData}) => {
          // console.log('previewData', JSON.stringify(previewData, null, 2));
          return (
            <View style={styles.previewContainer}>
              {Boolean(
                previewData?.image?.url && previewData?.image?.url?.length > 0,
              ) && (
                <Image
                  source={{uri: previewData?.image?.url}}
                  style={{
                    width: '100%',
                    height: 200,
                    overflow: 'hidden',
                    marginBottom: 10,
                  }}
                />
              )}
              {Boolean(
                previewData?.title && previewData?.title?.length > 0,
              ) && <Text style={styles.title}>{previewData?.title}</Text>}
              {Boolean(
                previewData?.description &&
                  previewData?.description?.length > 0,
              ) && (
                <Text style={styles.description}>
                  {previewData?.description}
                </Text>
              )}
            </View>
          );
        }}
      />
    );
  }
};

export default MessagePreviewContainer;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    meetContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      width: '50%',
    },
    previewContainer: {
      backgroundColor: Colors.Foreground,
      borderRadius: 10,
      marginTop: 5,
      overflow: 'hidden',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.BodyText,
      padding: 5,
    },
    description: {
      fontSize: 16,
      color: Colors.BodyText,
      padding: 5,
      paddingTop: 0,
    },
  });

// // components/ChatMessage.js

// import React from 'react';
// import { View, Text, StyleSheet, Dimensions } from 'react-native';
// import YouTube from 'react-native-youtube-iframe';
// import Video from 'react-native-video';
// import Autolink from 'react-native-autolink';
// import { parseYouTubeUrl, isVideoUrl } from '../utils/parseVideoLink';

// const ChatMessage = ({ message }) => {
//   // Extract URLs from the message text
//   const urls = extractUrls(message.text); // Implement this function or use a library

//   return (
//     <View style={styles.container}>
//       <Autolink
//         text={message.text}
//         onPress={(url) => {
//           // Handle link press if needed
//         }}
//         style={styles.text}
//       />
//       {urls.map((url, index) => {
//         if (isVideoUrl(url)) {
//           const youtubeId = parseYouTubeUrl(url);
//           if (youtubeId) {
//             return (
//               <View key={index} style={styles.videoContainer}>
//                 <YouTube
//                   videoId={youtubeId}
//                   height={200}
//                   width={Dimensions.get('window').width * 0.8}
//                   play={false}
//                 />
//               </View>
//             );
//           } else {
//             return (
//               <View key={index} style={styles.videoContainer}>
//                 <Video
//                   source={{ uri: url }}
//                   style={styles.video}
//                   controls
//                   resizeMode="contain"
//                 />
//               </View>
//             );
//           }
//         }
//         return null;
//       })}
//     </View>
//   );
// };

// // Utility function to extract URLs from text
// const extractUrls = (text) => {
//   const urlRegex = /(https?:\/\/[^\s]+)/g;
//   return text.match(urlRegex) || [];
// };

// const styles = StyleSheet.create({
//   container: {
//     marginVertical: 5,
//     padding: 10,
//     backgroundColor: '#f1f0f0',
//     borderRadius: 8,
//     maxWidth: '80%',
//   },
//   text: {
//     fontSize: 16,
//     color: '#333',
//   },
//   videoContainer: {
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   video: {
//     width: Dimensions.get('window').width * 0.8,
//     height: 200,
//   },
// });

// export default ChatMessage;

// // screens/ChatScreen.js

// import React, { useState } from 'react';
// import { View, FlatList, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
// import ChatMessage from '../components/ChatMessage';

// const ChatScreen = () => {
//   const [messages, setMessages] = useState([
//     { id: '1', text: 'Hello! Check out this video: https://youtu.be/dQw4w9WgXcQ' },
//     { id: '2', text: 'Here is a cool video: https://www.example.com/video.mp4' },
//     // Add more messages as needed
//   ]);
//   const [inputText, setInputText] = useState('');

//   const sendMessage = () => {
//     if (inputText.trim() === '') return;

//     const newMessage = {
//       id: (messages.length + 1).toString(),
//       text: inputText,
//     };

//     setMessages([...messages, newMessage]);
//     setInputText('');
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.container}
//     >
//       <FlatList
//         data={messages}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => <ChatMessage message={item} />}
//         contentContainerStyle={styles.messageList}
//       />
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Type a message..."
//           value={inputText}
//           onChangeText={setInputText}
//         />
//         <Button title="Send" onPress={sendMessage} />
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   messageList: {
//     padding: 10,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     padding: 10,
//     borderTopColor: '#ddd',
//     borderTopWidth: 1,
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   input: {
//     flex: 1,
//     borderColor: '#ddd',
//     borderWidth: 1,
//     borderRadius: 20,
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     marginRight: 10,
//   },
// });

// export default ChatScreen;

// //parseVideoLink.js

// export const parseYouTubeUrl = (url) => {
//   const regex =
//     /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
//   const match = url.match(regex);
//   return match ? match[1] : null;
// };

// export const isVideoUrl = (url) => {
//   const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.wmv', '.flv', '.webm'];
//   const isDirectVideo =
//     videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));

//   const isYouTube = parseYouTubeUrl(url) !== null;

//   return isDirectVideo || isYouTube;
// };

// // ### **`components/ChatMessage.js`**

// import React from 'react';
// import { View, Text, StyleSheet, Dimensions } from 'react-native';
// import YouTube from 'react-native-youtube-iframe';
// import Video from 'react-native-video';
// import Autolink from 'react-native-autolink';
// import { parseYouTubeUrl, isVideoUrl } from '../utils/parseVideoLink';

// const ChatMessage = ({ message }) => {
//   const urls = extractUrls(message.text);

//   return (
//     <View style={styles.container}>
//       <Autolink
//         text={message.text}
//         onPress={(url) => {
//           // Optional: Handle link press
//         }}
//         style={styles.text}
//       />
//       {urls.map((url, index) => {
//         if (isVideoUrl(url)) {
//           const youtubeId = parseYouTubeUrl(url);
//           if (youtubeId) {
//             return (
//               <View key={index} style={styles.videoContainer}>
//                 <YouTube
//                   videoId={youtubeId}
//                   height={200}
//                   width={Dimensions.get('window').width * 0.8}
//                   play={false}
//                 />
//               </View>
//             );
//           } else {
//             return (
//               <View key={index} style={styles.videoContainer}>
//                 <Video
//                   source={{ uri: url }}
//                   style={styles.video}
//                   controls
//                   resizeMode="contain"
//                 />
//               </View>
//             );
//           }
//         }
//         return null;
//       })}
//     </View>
//   );
// };

// const extractUrls = (text) => {
//   const urlRegex = /(https?:\/\/[^\s]+)/g;
//   return text.match(urlRegex) || [];
// };

// const styles = StyleSheet.create({
//   container: {
//     marginVertical: 5,
//     padding: 10,
//     backgroundColor: '#f1f0f0',
//     borderRadius: 8,
//     maxWidth: '80%',
//   },
//   text: {
//     fontSize: 16,
//     color: '#333',
//   },
//   videoContainer: {
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   video: {
//     width: Dimensions.get('window').width * 0.8,
//     height: 200,
//   },
// });

// export default React.memo(ChatMessage);

// import React, { useState } from 'react';
// import { View, FlatList, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
// import ChatMessage from '../components/ChatMessage';

// const ChatScreen = () => {
//   const [messages, setMessages] = useState([
//     { id: '1', text: 'Hello! Check out this video: https://youtu.be/dQw4w9WgXcQ' },
//     { id: '2', text: 'Here is a cool video: https://www.example.com/video.mp4' },
//   ]);
//   const [inputText, setInputText] = useState('');

//   const sendMessage = () => {
//     if (inputText.trim() === '') return;

//     const newMessage = {
//       id: (messages.length + 1).toString(),
//       text: inputText,
//     };

//     setMessages([...messages, newMessage]);
//     setInputText('');
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.container}
//     >
//       <FlatList
//         data={messages}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => <ChatMessage message={item} />}
//         contentContainerStyle={styles.messageList}
//       />
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Type a message..."
//           value={inputText}
//           onChangeText={setInputText}
//         />
//         <Button title="Send" onPress={sendMessage} />
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   messageList: {
//     padding: 10,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     padding: 10,
//     borderTopColor: '#ddd',
//     borderTopWidth: 1,
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   input: {
//     flex: 1,
//     borderColor: '#ddd',
//     borderWidth: 1,
//     borderRadius: 20,
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     marginRight: 10,
//   },
// });

// export default ChatScreen;
