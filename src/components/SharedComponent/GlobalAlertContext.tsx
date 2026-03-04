import React, {createContext, useContext, useState, ReactNode} from 'react';
import Modal from 'react-native-modal';
import {Text, View, StyleSheet} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {RegularFonts} from '../../constants/Fonts';
import AlertIcon2 from '../../assets/Icons/AlertIcon2';
import ErrorIcon from '../../assets/Icons/ErrorIcon';
import SuccessIcon from '../../assets/Icons/SuccessIcon';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {TColors} from '../../types';

// Define the type for the alert data
type DataProps = {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning';
  link?: string;
};

// Define the context type
type AlertContextType = {
  showAlert: (d: DataProps) => void;
};

// Create a context with an initial undefined value
const AlertContext = createContext<AlertContextType | undefined>(undefined);

// Define the props for the AlertProvider component
type AlertProviderProps = {
  children: ReactNode;
};

export const AlertProvider: React.FC<AlertProviderProps> = ({children}) => {
  // Using null instead of empty object as the default value for data
  const [data, setData] = useState<DataProps | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const showAlert = (d: DataProps) => {
    setData(d);
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 2000);
  };

  return (
    <AlertContext.Provider value={{showAlert}}>
      {children}
      <Modal
        isVisible={isVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropTransitionOutTiming={0}
        onBackdropPress={() => setIsVisible(false)}>
        <View style={styles.alertBox}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: -70,
              shadowColor: Colors.PureWhite,
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.29,
              shadowRadius: 4.65,
              elevation: 3,
            }}>
            {data?.type === 'error' ? (
              <ErrorIcon />
            ) : data?.type === 'warning' ? (
              <AlertIcon2 />
            ) : (
              <SuccessIcon />
            )}
          </View>
          <Text style={styles.heading}>{data?.title || 'Success'}</Text>
          <Text style={styles.alertText}>
            {data?.message || 'Task is successful!'}
          </Text>
          {data?.link && <Text style={styles.linkText}>{data.link}</Text>}
        </View>
      </Modal>
    </AlertContext.Provider>
  );
};

// Custom hook to use the alert context
export const useGlobalAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useGlobalAlert must be used within an AlertProvider');
  }
  return context;
};

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    alertBox: {
      backgroundColor: Colors.Foreground,
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      gap: 10,
    },
    alertText: {
      color: Colors.BodyText,
      fontSize: RegularFonts.BL,
      textAlign: 'center',
      fontFamily: CustomFonts.REGULAR,
    },
    linkText: {
      color: Colors.Primary,
      fontSize: RegularFonts.BL,
      textAlign: 'center',
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    heading: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: RegularFonts.HL,
      color: Colors.Heading,
      textAlign: 'center',
    },
    markdownStyle: {
      bullet_list: {
        marginVertical: 10,
      },
      ordered_list: {
        marginVertical: 10,
      },
      list_item: {
        marginVertical: 10,
      },
      body: {
        flex: 1,
        width: responsiveScreenWidth(73),
        color: Colors.BodyText,
        fontFamily: CustomFonts.REGULAR,
        lineHeight: 24,
        textAlign: 'justify',
        marginBottom: responsiveScreenHeight(1.5),
      },
      heading1: {
        flex: 1,
        width: responsiveScreenWidth(73),
        fontSize: 24,
        color: Colors.Heading,
        marginBottom: 10,
      },
      heading2: {
        flex: 1,
        width: responsiveScreenWidth(73),
        fontSize: 20,
        color: Colors.Heading,
        marginBottom: 8,
      },
      heading3: {
        flex: 1,
        width: responsiveScreenWidth(73),
        fontSize: 18,
        color: Colors.Heading,
        marginBottom: 6,
      },
      paragraph: {
        flex: 1,
        width: responsiveScreenWidth(73),
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'justify',
      },
      link: {
        flex: 1,
        width: responsiveScreenWidth(73),
        color: Colors.Primary,
      },
      blockquote: {
        flex: 1,
        width: responsiveScreenWidth(73),
        backgroundColor: Colors.Foreground,
        borderRadius: 4,
        padding: 8,
        fontFamily: 'monospace',
      },
      code_block: {
        flex: 1,
        width: responsiveScreenWidth(73),
        backgroundColor: Colors.Foreground,
        borderRadius: 4,
        padding: 8,
        fontFamily: 'monospace',
      },
      code_inline: {
        flex: 1,
        width: responsiveScreenWidth(73),
        backgroundColor: Colors.Foreground,
        borderRadius: 4,
        padding: 4,
        fontFamily: 'monospace',
      },
    } as any,
  });
