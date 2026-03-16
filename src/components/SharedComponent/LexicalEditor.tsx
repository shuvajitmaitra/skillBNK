import React, {useCallback, useMemo, useRef, useState} from 'react';
import {View, ViewStyle, Text} from 'react-native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import environment from '../../constants/environment';

type EditorPayload = {
  note?: string;
  theme?: 'light' | 'dark';
  [key: string]: any;
};

type LexicalEditorProps = {
  data: EditorPayload;
  onChange?: (data: any) => void;
  containerStyle?: ViewStyle;
  theme?: 'light' | 'dark';
};

const LexicalEditor = ({
  data,
  onChange,
  containerStyle,
  theme = 'dark',
}: LexicalEditorProps) => {
  const webviewRef = useRef<WebView>(null);
  const [error, setError] = useState<string | null>(null);

  const payload = useMemo(
    () => ({
      ...data,
      theme,
    }),
    [data, theme],
  );

  const sendToWeb = useCallback(
    (obj: EditorPayload) => {
      try {
        const serializedData = JSON.stringify(obj);
        const serializedTheme = JSON.stringify(obj.theme || theme);

        const script = `
        (function() {
          try {
            window.__RN_EDITOR_DATA__ = ${serializedData};
            localStorage.setItem('theme', ${serializedTheme});

            if (typeof window.receiveData === 'function') {
              window.receiveData(window.__RN_EDITOR_DATA__);
            } else {
              document.dispatchEvent(
                new CustomEvent('RN_EDITOR_DATA', {
                  detail: window.__RN_EDITOR_DATA__
                })
              );
            }

            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
              JSON.stringify({
                type: 'DATA_RECEIVED'
              })
            );
          } catch (e) {
            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
              JSON.stringify({
                type: 'ERROR',
                error: e?.message || 'Failed to inject data'
              })
            );
          }
        })();
        true;
      `;

        webviewRef.current?.injectJavaScript(script);
      } catch (e: any) {
        setError(`Failed to send data: ${e.message}`);
      }
    },
    [theme],
  );

  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const message = JSON.parse(event.nativeEvent.data);

        if (message.type === 'READY') {
          setError(null);
          sendToWeb(payload);
          return;
        }

        if (message.type === 'ERROR' && message.error) {
          setError(message.error);
          return;
        }

        onChange?.(message);
      } catch {
        onChange?.(event.nativeEvent.data);
      }
    },
    [onChange, payload, sendToWeb],
  );

  const onError = useCallback((syntheticEvent: any) => {
    const {nativeEvent} = syntheticEvent;
    const errorMsg =
      nativeEvent?.description || nativeEvent?.title || 'Unknown error';
    setError(`Failed to load editor: ${errorMsg}`);
    console.error('WebView error:', nativeEvent);
  }, []);

  const injectedJavaScriptBeforeContentLoaded = `
    (function() {
      window.__RN_EDITOR_DATA__ = null;
      true;
    })();
  `;

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
        source={{uri: `${environment.FRONTEND_URL}/editor`}}
        onMessage={onMessage}
        onError={onError}
        injectedJavaScriptBeforeContentLoaded={
          injectedJavaScriptBeforeContentLoaded
        }
        style={{backgroundColor: theme === 'dark' ? '#000' : '#fff'}}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
        allowsInlineMediaPlayback
        mixedContentMode="always"
      />
    </View>
  );
};

export default LexicalEditor;
