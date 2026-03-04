import {View, ViewStyle, Text} from 'react-native';
import React, {useRef, useState} from 'react';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import environment from '../../constants/environment';

type LexicalEditorProps = {
  data: object;
  onChange?: (data: any) => void;
  containerStyle?: ViewStyle;
  theme?: 'light' | 'dark';
};

const LexicalEditor = ({
  data,
  onChange,
  containerStyle,
  theme = 'light',
}: LexicalEditorProps) => {
  const webviewRef = useRef<WebView>(null);
  const [error, setError] = useState<string | null>(null);

  const sendToWeb = (obj: object) => {
    try {
      const script = `
        (function() {
          try {
            if (window.receiveData) {
              window.receiveData(${JSON.stringify(obj)});
            }
          } catch (e) {
            window.ReactNativeWebView?.postMessage(JSON.stringify({
              type: 'ERROR',
              error: e.message
            }));
          }
        })();
      `;
      webviewRef.current?.injectJavaScript(script);
    } catch (e: any) {
      setError(`Failed to send data: ${e.message}`);
    }
  };

  const onMessage = (event: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === 'ERROR' && message.error) {
        setError(message.error);
      }
      onChange?.(message);
    } catch {
      onChange?.(event.nativeEvent.data);
    }
  };

  const onError = (syntheticEvent: any) => {
    const {nativeEvent} = syntheticEvent;
    const errorMsg =
      nativeEvent?.description || nativeEvent?.title || 'Unknown error';
    setError(`Failed to load editor: ${errorMsg}`);
    console.error('WebView error:', nativeEvent);
  };

  if (error) {
    return (
      <View
        style={{
          height: responsiveScreenHeight(30),
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme === 'dark' ? '#000' : '#fff',
          padding: 20,
          ...containerStyle,
        }}>
        <Text style={{color: '#ff4444', textAlign: 'center'}}>{error}</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        height: responsiveScreenHeight(30),
        width: '100%',
        ...containerStyle,
      }}>
      <WebView
        ref={webviewRef}
        source={{uri: `${environment.FRONTEND_URL}/editor/`}}
        onMessage={onMessage}
        onLoad={() => sendToWeb(data)}
        onError={onError}
        style={{backgroundColor: theme === 'dark' ? '#000' : '#fff'}}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
      />
    </View>
  );
};

export default LexicalEditor;
