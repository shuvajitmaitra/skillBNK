import React, {useRef, useState} from 'react';
import {WebView} from 'react-native-webview';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {storage} from '../../utility/mmkvInstance';
import {mStore} from '../../utility/mmkvStoreName';
import {goBack} from '../../navigation/NavigationService';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';

const ProtectedWebView = ({url}: {url: string}) => {
  const webViewRef = useRef<WebView>(null);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {top} = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);

  const accessToken = storage?.getString(mStore.USER_TOKEN);

  const enroll = storage?.getString('active_enrolment');

  const org = storage?.getString('organization');
  const theme = storage?.getString('displayMode');
  console.log('theme', JSON.stringify(theme, null, 2));

  let authData = {
    accessToken: '',
    organizationId: '',
    enrollmentId: '',
    theme: theme || 'light',
  };

  if (accessToken) {
    authData.accessToken = accessToken;
  }
  if (enroll) {
    let enrollId = JSON.parse(enroll)?._id;
    if (enrollId) {
      authData.enrollmentId = enrollId;
    }
  }
  if (org) {
    let orgId = JSON.parse(org)?._id;
    if (orgId) {
      authData.organizationId = orgId;
    }
  }
  const injectLocalStorageScript = `
  (function() {
    ${Object.entries(authData)
      .map(([key, value]) => {
        const safeValue =
          typeof value === 'string'
            ? value.replace(/"/g, '\\"')
            : JSON.stringify(value).replace(/"/g, '\\"');
        return `localStorage.setItem("${key}", "${safeValue}");`;
      })
      .join('\n')}
    window.dispatchEvent(new Event('storage'));           
    window.dispatchEvent(new CustomEvent('auth-updated')); 

    console.log('[RN injected] Token updated & event dispatched');
    true;
  })();
`;
  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: top,
          backgroundColor: theme === 'dark' ? '#121212' : '#F5F5F5',
        },
      ]}>
      {loading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loading}
        />
      )}

      <WebView
        ref={webViewRef}
        source={{uri: url}}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={['*']}
        injectedJavaScriptBeforeContentLoaded={injectLocalStorageScript}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
        onMessage={event => {
          console.log('Message from web:', event.nativeEvent.data);
          const data = JSON.parse(event.nativeEvent.data);
          if (data.type === 'GO_BACK') {
            goBack();
          }
        }}
        allowsFullscreenVideo={true}
      />
    </View>
  );
};

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {flex: 1, backgroundColor: Colors.Background_color},
    webview: {flex: 1},
    loading: {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0},
  });

export default ProtectedWebView;
