import React, {useMemo, useRef, useState} from 'react';
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

  const accessToken = storage?.getString(mStore.USER_TOKEN) || '';
  const enroll = storage?.getString('active_enrolment');
  const org = storage?.getString('organization');
  const theme = storage?.getString('displayMode') || 'light';

  let enrollmentId = '';
  let organizationId = '';

  try {
    if (enroll) {
      enrollmentId = JSON.parse(enroll)?._id || '';
    }
  } catch (e) {
    console.log('Invalid active_enrolment JSON', e);
  }

  try {
    if (org) {
      organizationId = JSON.parse(org)?._id || '';
    }
  } catch (e) {
    console.log('Invalid organization JSON', e);
  }

  const injectedData = useMemo(
    () => ({
      accessToken,
      enrollmentId,
      organizationId,
      theme,
    }),
    [accessToken, enrollmentId, organizationId, theme],
  );

  const injectAuthScript = `
    (function() {
      try {
        var data = ${JSON.stringify(injectedData)};

        function setCookie(name, value) {
          if (!value) return;
          document.cookie = name + '=' + encodeURIComponent(value) + '; path=/';
        }

        // localStorage + sessionStorage
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
          sessionStorage.setItem('accessToken', data.accessToken);
        }

        if (data.organizationId) {
          localStorage.setItem('organizationId', data.organizationId);
          sessionStorage.setItem('organizationId', data.organizationId);
        }

        if (data.enrollmentId) {
          localStorage.setItem('enrollmentId', data.enrollmentId);
          sessionStorage.setItem('enrollmentId', data.enrollmentId);

          // web storage helper যদি active_enrolment খোঁজে
          localStorage.setItem(
            'active_enrolment',
            JSON.stringify({ _id: data.enrollmentId })
          );
          sessionStorage.setItem(
            'active_enrolment',
            JSON.stringify({ _id: data.enrollmentId })
          );
        }

        if (data.theme) {
          localStorage.setItem('displayMode', data.theme);
          sessionStorage.setItem('displayMode', data.theme);
        }

        // cookies for website axios
        if (data.accessToken) {
          setCookie('accessToken', data.accessToken);
        }

        if (data.organizationId) {
          setCookie('activeCompany', data.organizationId);
        }

        // optional extra cookie names for compatibility
        if (data.enrollmentId) {
          setCookie('enrollmentId', data.enrollmentId);
        }

        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('auth-updated', { detail: data }));

        true;
      } catch (e) {
        true;
      }
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
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        originWhitelist={['*']}
        injectedJavaScriptBeforeContentLoaded={injectAuthScript}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
        onMessage={event => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            console.log('Message from web:', data);
            if (data.type === 'GO_BACK') {
              goBack();
            }
          } catch (e) {
            console.log('e.response', JSON.stringify(e, null, 2));
            console.log('Non-JSON message from web:', event.nativeEvent.data);
          }
        }}
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
