import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useTheme} from '../../context/ThemeContext';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import Markdown from 'react-native-markdown-display';
import moment from 'moment';
import DoubleArrowLeftIcon from '../../assets/Icons/DoubleArrowLeftIcon';
import DoubleArrowRightIcon from '../../assets/Icons/DoubleArrowRightIcon';
import DownloadIconTwo from '../../assets/Icons/DownloadIconTwo';
import Divider from '../../components/SharedComponent/Divider';
import BackNextButton from '../../components/SharedComponent/BackNextButton';
import {extractFilename, handleOpenLink} from '../../components/HelperFunction';
import {getFileTypeFromUri} from '../../components/TechnicalTestCom/TestNow';
import Images from '../../constants/Images';
import {theme} from '../../utility/commonFunction';

const ShowNTellDetails = ({route}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const {showNTell} = useSelector(state => state.showNTell);
  const [dataIndex, setDataIndex] = useState(route?.params?.index || 0);
  const [imageNumber, setImageNumber] = useState(0);

  const data = showNTell[dataIndex];
  const attachments = data?.attachments || [];
  const currentAttachment = attachments[imageNumber] || null;

  const renderAttachment = () => {
    const fileType = getFileTypeFromUri(currentAttachment);

    if (fileType === 'unknown') {
      return <Image style={styles.image} source={Images.SNT_DEFAULT} />;
    }
    if (fileType === 'image') {
      return <Image style={styles.image} source={{uri: currentAttachment}} />;
    }

    const placeholders = {
      pdf: require('../../assets/Images/placeholder-pdf.png'),
      document: require('../../assets/Images/placeholder-doc.png'),
      default: require('../../assets/Images/placeholder-default.png'),
    };

    return (
      <>
        <Image
          style={styles.image}
          source={placeholders[fileType] || placeholders.default}
        />
        <View style={styles.fileNameContainer}>
          <Text style={styles.fileName}>
            {extractFilename(currentAttachment)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleOpenLink(currentAttachment)}
          style={
            fileType === 'pdf' ? styles.downloadIcon : styles.downloadIconDoc
          }>
          <Text style={styles.downloadText}>
            Download {fileType?.toUpperCase() || 'File'}
          </Text>
          <DownloadIconTwo />
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor={Colors.Foreground}
        barStyle={theme() === 'light' ? 'dark-content' : 'light-content'}
      />
      <ScrollView>
        <View style={styles.testContainer}>
          {/* Header */}
          <View style={styles.headingContainer}>
            <Text style={styles.title}>Show N Tell</Text>
            {showNTell?.length > 1 && (
              <BackNextButton
                dataIndex={dataIndex}
                setDataIndex={setDataIndex}
                length={showNTell.length}
              />
            )}
          </View>

          {/* Attachment Viewer */}
          <View style={styles.attachmentContainer}>
            {imageNumber > 0 && attachments.length > 1 && (
              <TouchableOpacity
                onPress={() => setImageNumber(imageNumber - 1)}
                style={styles.navigationButtonLeft}>
                <DoubleArrowLeftIcon />
              </TouchableOpacity>
            )}
            {renderAttachment()}
            {imageNumber < attachments.length - 1 && (
              <TouchableOpacity
                onPress={() => setImageNumber(imageNumber + 1)}
                style={styles.navigationButtonRight}>
                <DoubleArrowRightIcon />
              </TouchableOpacity>
            )}
          </View>

          {/* Details */}
          <Text style={styles.title}>{data?.title}</Text>
          <View style={styles.statusContainer}>
            <Text style={styles.statusTitle}>Date: </Text>
            <Text style={styles.statusText}>
              {moment(data?.createdAt).format('MMM DD, YYYY')}
            </Text>
          </View>
          <View style={styles.statusContainer}>
            <Text style={styles.statusTitle}>Status: </Text>
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    data?.status === 'accepted'
                      ? Colors.Primary
                      : data?.status === 'pending'
                      ? Colors.PureYellow
                      : Colors.Red,
                },
              ]}>
              {data?.status}
            </Text>
          </View>

          {/* Agenda */}
          <Divider />
          <Text style={styles.agendaText}>Agenda:</Text>
          <View style={styles.markdownContainer}>
            <Markdown style={styles.markdownStyle}>{data?.agenda}</Markdown>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ShowNTellDetails;

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
    },
    testContainer: {
      backgroundColor: Colors.Foreground,
      padding: responsiveScreenWidth(3),
      marginVertical: responsiveScreenHeight(2),
      borderRadius: responsiveScreenWidth(3),
    },
    headingContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: responsiveScreenHeight(3),
    },
    title: {
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    attachmentContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: 10,
      resizeMode: 'contain',
      backgroundColor: Colors.PrimaryOpacityColor,
    },
    navigationButtonLeft: {
      position: 'absolute',
      left: responsiveScreenWidth(-5),
      zIndex: 1,
    },
    navigationButtonRight: {
      position: 'absolute',
      right: responsiveScreenWidth(-5),
      zIndex: 1,
    },
    fileNameContainer: {
      position: 'absolute',
      alignItems: 'center',
      top: responsiveScreenHeight(3),
    },
    downloadIcon: {
      flexDirection: 'row',
      alignItems: 'center',
      position: 'absolute',
      top: responsiveScreenHeight(12),
      backgroundColor: Colors.PureWhite,
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 7,
    },
    downloadIconDoc: {
      backgroundColor: Colors.PureWhite,
    },
    downloadText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.8),
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: responsiveScreenHeight(0.5),
    },
    statusTitle: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.8),
    },
    statusText: {
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.8),
      textTransform: 'capitalize',
    },
    agendaText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.2),
      color: Colors.Heading,
    },
    markdownContainer: {
      paddingRight: responsiveScreenWidth(2),
    },
    markdownStyle: {
      body: {
        color: Colors.BodyText,
        fontFamily: CustomFonts.REGULAR,
        lineHeight: 24,
        textAlign: 'justify',
      },
    },
  });
