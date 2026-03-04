import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
import NoInternetIcon from '../../assets/Icons/NoInternetIcon';

const NoInternetScreen = ({onRetry}: {onRetry: () => void}) => {
  const [loading, setLoading] = useState(false);
  //   const [hasInternet, setHasInternet] = useState<boolean>(false);
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const handleRetry = async () => {
    setLoading(true);
    const state = await NetInfo.fetch();
    // setHasInternet(!!state.isConnected);
    setLoading(false);

    if (state.isConnected && onRetry) {
      onRetry();
    }
  };

  return (
    <View style={styles.container}>
      {/* Internet Disconnected Image */}
      {/* <Image
        source={Images.DEFAULT_IMAGE}
        style={styles.image}
        resizeMode="contain"
      /> */}
      <NoInternetIcon color={Colors.BodyText} size={200} />

      {/* No Internet Message */}
      <Text style={styles.title}>No Internet Connection</Text>
      <Text style={styles.subtitle}>
        Please check your network settings and try again.
      </Text>

      {/* Retry Button */}
      <TouchableOpacity
        style={styles.retryButton}
        onPress={handleRetry}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.retryText}>Retry</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.Background_color,
      padding: 20,
    },
    image: {
      width: 250,
      height: 250,
      marginBottom: 20,
      borderRadius: 200,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: Colors.Heading,
      marginBottom: 10,
      marginTop: 100,
    },
    subtitle: {
      fontSize: 16,
      color: Colors.BodyText,
      textAlign: 'center',
      marginBottom: 50,
    },
    retryButton: {
      backgroundColor: '#007bff',
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 8,
      elevation: 3,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 4,
      shadowOffset: {width: 0, height: 2},
    },
    retryText: {
      fontSize: 16,
      color: '#fff',
      fontWeight: 'bold',
    },
  });

export default NoInternetScreen;
