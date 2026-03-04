import {
  Image,
  ImageStyle,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import ArrowLeftWhite from '../../assets/Icons/ArrowLeftWhite';
import ArrowRightWhite from '../../assets/Icons/ArrowRightWhite';
import {useTheme} from '../../context/ThemeContext';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import moment from 'moment';
import Markdown from 'react-native-markdown-display';
import {useSelector} from 'react-redux';
import DoubleArrowLeft from '../../assets/Icons/DoubleArrowLeftIcon';
import DoubleArrowRightIcon from '../../assets/Icons/DoubleArrowRightIcon';
import {getFileTypeFromUri} from '../../components/TechnicalTestCom/TestNow';
import ImageView from 'react-native-image-viewing';
import {extractFilename, handleOpenLink} from '../../components/HelperFunction';
import DownloadIconTwo from '../../assets/Icons/DownloadIconTwo';
import {RootState} from '../../types/redux/root';
import {MarkdownStylesProps} from '../../types/markdown/markdown';
import {TColors} from '../../types';
import {RegularFonts} from '../../constants/Fonts';
import {fontSizes, gFontSize} from '../../constants/Sizes';
import {theme} from '../../utility/commonFunction';
type ActivityDetailsProps = {
  route: {
    params: {
      index: number;
    };
  };
};

const ActivitiesDetails = ({route}: ActivityDetailsProps) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [dataIndex, setDataIndex] = useState(route?.params?.index);
  const {activities} = useSelector((state: RootState) => state.activities);
  const data = activities[dataIndex];
  const [imageNumber, setImageNumber] = useState(0);
  const [viewImage, setViewImage] = useState<Array<{uri: string}>>([]);
  return (
    <View style={styles.container}>
      <StatusBar
        translucent={true}
        backgroundColor={Colors.Foreground}
        barStyle={theme() === 'light' ? 'dark-content' : 'light-content'}
      />

      <View style={styles.contain}>
        <View style={styles.headingContainer}>
          <Text style={styles.title}>Day-To-Day Activities</Text>
          <View style={styles.btnContainer}>
            {/* Show Back Button only when dataIndex > 0 */}
            {dataIndex > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setDataIndex(dataIndex - 1);
                }}
                activeOpacity={0.5}
                style={[
                  styles.backBtn,
                  {
                    backgroundColor: Colors.PrimaryButtonBackgroundColor,
                  },
                ]}>
                <ArrowLeftWhite color={Colors.PrimaryButtonTextColor} />
                <Text
                  style={{
                    color: Colors.PrimaryButtonTextColor,
                  }}>
                  Back
                </Text>
              </TouchableOpacity>
            )}

            {/* Show Next Button only when dataIndex < activities?.length - 1 */}
            {dataIndex < activities?.length - 1 && (
              <TouchableOpacity
                onPress={() => {
                  setDataIndex(dataIndex + 1);
                }}
                activeOpacity={0.5}
                style={[
                  styles.nextBtn,
                  {
                    backgroundColor: Colors.SecondaryButtonBackgroundColor,
                  },
                ]}>
                <Text
                  style={{
                    color: Colors.SecondaryButtonTextColor,
                  }}>
                  Next
                </Text>
                <ArrowRightWhite color={Colors.SecondaryButtonTextColor} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <ScrollView>
          {/* -------------
                  -----------top section--------
                  ------------------------------------ */}
          <View style={styles.testContainer}>
            <ImageView
              images={viewImage}
              imageIndex={0}
              visible={viewImage?.length !== 0}
              onRequestClose={() => setViewImage([])}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}>
              {imageNumber > 0 && data?.attachments?.length > 1 ? (
                <TouchableOpacity
                  onPress={() => setImageNumber(imageNumber - 1)}
                  style={{
                    position: 'absolute',
                    left: responsiveScreenWidth(-5),
                    zIndex: 1,
                  }}>
                  <DoubleArrowLeft />
                </TouchableOpacity>
              ) : null}
              {getFileTypeFromUri(data?.attachments[imageNumber]) ===
              'image' ? (
                <TouchableOpacity
                  style={styles.image}
                  onPress={() => {
                    const imageUri = data?.attachments?.[imageNumber];
                    setViewImage(imageUri ? [{uri: imageUri}] : []);
                  }}>
                  <Image
                    style={{
                      width: '100%',
                      height: 200,
                      borderRadius: 10,
                    }}
                    source={{uri: data?.attachments[imageNumber]}}
                  />
                </TouchableOpacity>
              ) : // <TouchableOpacity
              //   onPress={() => setViewImage(data?.attachments[imageNumber])}
              // >
              //   <Image
              //     style={styles.image}
              //     source={{ uri: data?.attachments[imageNumber] }}
              //   />
              // </TouchableOpacity>
              getFileTypeFromUri(data?.attachments[imageNumber]) === 'pdf' ? (
                <>
                  <Image
                    style={styles.image as ImageStyle}
                    source={require('../../assets/Images/placeholder-pdf.png')}
                  />
                  <Text style={styles.fileName}>
                    {extractFilename(data?.attachments[imageNumber])}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      handleOpenLink(data?.attachments[imageNumber])
                    }
                    style={styles.downloadIcon}>
                    <DownloadIconTwo color={Colors.PureGray} size={30} />
                  </TouchableOpacity>
                </>
              ) : getFileTypeFromUri(data?.attachments[imageNumber]) ===
                'document' ? (
                <>
                  <Image
                    resizeMode="cover"
                    style={styles.image as ImageStyle}
                    source={require('../../assets/Images/placeholder-doc.png')}
                  />
                  <Text style={styles.fileName}>
                    {extractFilename(data?.attachments[imageNumber])}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      handleOpenLink(data?.attachments[imageNumber])
                    }
                    style={styles.downloadIcon}>
                    <DownloadIconTwo color={Colors.PureGray} size={30} />
                  </TouchableOpacity>
                </>
              ) : (
                <Image
                  resizeMode="cover"
                  style={styles.image as ImageStyle}
                  source={require('../../assets/Images/placeholder-default.png')}
                />
              )}
              {imageNumber < data?.attachments?.length - 1 &&
              data?.attachments?.length > 1 ? (
                <TouchableOpacity
                  onPress={() => setImageNumber(imageNumber + 1)}
                  style={{
                    position: 'absolute',
                    right: responsiveScreenWidth(-5),
                    zIndex: 1,
                  }}>
                  <DoubleArrowRightIcon />
                </TouchableOpacity>
              ) : null}
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.titleText}>{data?.title}</Text>
            </View>

            <View style={styles.statusContainer}>
              <Text style={styles.statusTitle}>Date:</Text>
              <Text style={styles.statusText}>
                {moment(data?.createdAt).format('MMM DD, YYYY')}
              </Text>
            </View>
            <View style={styles.statusContainer}>
              <Text style={styles.statusTitle}>Created By:</Text>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 7}}>
                <Image
                  style={styles.imageSmall as ImageStyle}
                  source={{uri: data?.sender?.profilePicture}}
                />
                <Text style={styles.statusText}>{data?.sender.fullName}</Text>
              </View>
            </View>
            <View style={styles.markdownContainer}>
              <Markdown style={styles.markdown as MarkdownStylesProps}>
                {data?.description}
              </Markdown>
            </View>
            {/* <View style={styles.line}></View> */}

            {/* -------------
                      -----------Report section--------
                      ------------------------------------ */}
            {/* <View>
              <Text style={styles.reportTitle}>Comments</Text>
              <View style={styles.reportContainer}>
                <Image
                  source={Images.DEFAULT_IMAGE}
                  style={styles.imgStyle}
                />

                <TextInput    keyboardAppearance={
            Colors.Background_color === "#F5F5F5" ? "light" : "dark"
          }
                  style={styles.report}
                  placeholderTextColor={Colors.Heading}
                  multiline={true}
                  placeholder="Typo, grammatical issue, etc..."
                />
              </View>
              <View style={styles.reportSubmit}>
                <TouchableOpacity onPress={() => {}} style={styles.reportBtn}>
                  <Text style={styles.reportBtnText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View> */}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ActivitiesDetails;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    downloadIcon: {
      position: 'absolute',
      top: responsiveScreenHeight(12),
    },
    fileName: {
      position: 'absolute',
      width: '70%',
      borderWidth: 1.5,
      borderColor: Colors.PureGray,
      color: Colors.PureGray,
      borderRadius: 5,
      paddingHorizontal: responsiveScreenWidth(3),
      paddingVertical: responsiveScreenHeight(0.5),
      textAlign: 'center',
      top: responsiveScreenHeight(6),
    },
    editIcon: {
      backgroundColor: Colors.PrimaryOpacityColor,
      padding: 7,
      borderRadius: 5,
    },
    deleteIcon: {
      backgroundColor: Colors.LightRed,
      padding: 7,
      borderRadius: 5,
    },
    imageSmall: {
      width: 20,
      height: 20,
      borderRadius: 100,
    },
    markdownContainer: {
      // backgroundColor: 'red',
      // marginTop: 10,
      paddingRight: responsiveScreenWidth(2),
    },
    markdown: {
      whiteSpace: 'pre',
      body: {
        fontFamily: CustomFonts.REGULAR,
        fontSize: fontSizes.body,
        color: Colors.BodyText,
        lineHeight: gFontSize(25),
      },
      paragraph: {
        marginTop: 0, // Remove top margin from paragraphs
        marginBottom: 0, // Remove bottom margin from paragraphs
        padding: 0, // Remove padding from paragraphs
      },
      link: {
        color: Colors.Primary,
        fontFamily: CustomFonts.SEMI_BOLD,
        fontSize: fontSizes.body,
      },
      heading1: {
        fontFamily: CustomFonts.REGULAR,
        fontSize: fontSizes.body,
        marginVertical: 4,
        fontWeight: '500',
      },
      heading2: {
        fontFamily: CustomFonts.REGULAR,
        fontSize: fontSizes.body,
        marginVertical: 4,
        fontWeight: '500',
      },
      heading3: {
        fontFamily: CustomFonts.REGULAR,
        fontSize: fontSizes.body,
        marginVertical: 4,
        fontWeight: '500',
      },
      heading4: {
        fontFamily: CustomFonts.REGULAR,
        fontSize: fontSizes.body,
        marginVertical: 4,
        fontWeight: '500',
      },
      heading5: {
        fontFamily: CustomFonts.REGULAR,
        fontSize: fontSizes.body,
        marginVertical: 4,
        fontWeight: '500',
      },
      heading6: {
        fontFamily: CustomFonts.REGULAR,
        fontSize: fontSizes.body,
        marginVertical: 4,
        fontWeight: '500',
      },
      strong: {
        fontFamily: CustomFonts.LATO_BOLD,
        fontSize: fontSizes.body,
        fontWeight: '500',
      },
      em: {
        fontFamily: CustomFonts.REGULAR,
        fontStyle: 'italic',
        fontSize: fontSizes.body,
        fontWeight: '500',
      },
      code_inline: {
        backgroundColor: Colors.PrimaryOpacityColor,
      },
      fence: {
        marginBottom: 10,
        padding: 8,
        borderRadius: 6,
        backgroundColor: Colors.Foreground,
        borderWidth: 1,
        borderColor: Colors.BorderColor,
      },
      code_block: {
        borderWidth: 0,
        padding: 8,
        borderRadius: 6,
        fontFamily: CustomFonts.REGULAR,
        fontSize: RegularFonts.BS,
      },
      blockquote: {
        padding: 8,
        borderRadius: 6,
        marginVertical: 4,
        borderLeftWidth: 4,
        borderLeftColor: Colors.ThemeAnotherButtonColor,
      },
    } as any,
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
        color: Colors.BodyText,
        // fontSize: 16,

        fontFamily: CustomFonts.REGULAR,
        lineHeight: 24,
        textAlign: 'justify',
        marginBottom: responsiveScreenHeight(1.5),
      },
      heading1: {
        fontSize: 24,
        // color: "#000",
        color: Colors.Heading,
        marginBottom: 10,
        fontFamily: CustomFonts.MEDIUM,
      },
      heading2: {
        fontSize: 20,
        // color: "#000",
        color: Colors.Heading,
        marginBottom: 8,
        fontFamily: CustomFonts.MEDIUM,
      },
      heading3: {
        fontSize: 18,
        // color: "#000",
        color: Colors.Heading,
        marginBottom: 6,
        fontFamily: CustomFonts.SEMI_BOLD,
      },
      paragraph: {
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'justify',
      },
      link: {
        color: Colors.Primary,
        // marginBottom: 100,
      },
    } as any,
    statusText: {
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.8),
      textTransform: 'capitalize',
    },
    statusTitle: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.8),
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginTop: responsiveScreenHeight(0.5),
    },
    titleText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.Primary,
      flex: 1,
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: 10,
      marginBottom: responsiveScreenHeight(2),
    },
    contain: {
      backgroundColor: Colors.Background_color,
      paddingHorizontal: 10,
      // flex: 1
    },
    title: {
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      width: '50%',
    },
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
    },
    testContainer: {
      backgroundColor: Colors.Foreground,
      padding: 15,
      // marginTop: responsiveScreenHeight(2),
      borderRadius: responsiveScreenWidth(3),
      marginBottom: responsiveScreenHeight(10),
    },
    headingContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: responsiveScreenHeight(1),
      alignItems: 'center',
    },
    btnContainer: {
      flexDirection: 'row',
      // justifyContent: "space-between",
      gap: responsiveScreenWidth(2),
      height: responsiveScreenHeight(3.5),
      // alignItems: "center"
    },
    btnText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.PureWhite,
      textAlign: 'center',
    },
    backBtn: {
      paddingHorizontal: responsiveScreenWidth(2),
      // paddingVertical: responsiveScreenHeight(1),
      borderRadius: responsiveScreenWidth(2),
      backgroundColor: Colors.Primary,
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
      alignItems: 'center',
    },
    nextBtn: {
      paddingHorizontal: responsiveScreenWidth(2),
      // paddingVertical: responsiveScreenHeight(1),
      borderRadius: responsiveScreenWidth(2),
      backgroundColor: Colors.BodyText,
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
      alignItems: 'center',
    },

    line: {
      marginBottom: responsiveScreenHeight(2),
      borderBottomWidth: 1,
      borderBottomColor: Colors.LineColor,
      width: '100%',
      alignSelf: 'center',
    },
    reportTitle: {
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
    },
    reportContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(4),
      marginVertical: responsiveScreenHeight(1),
    },
    imgStyle: {
      width: 40,
      height: 40,
      borderRadius: responsiveScreenWidth(50),
    },
    report: {
      color: Colors.Heading,
      backgroundColor: Colors.ModalBoxColor,
      borderWidth: 1,
      overflow: 'hidden',
      textAlignVertical: 'top',

      borderColor: Colors.BorderColor,
      borderRadius: responsiveScreenWidth(3),
      fontFamily: CustomFonts.REGULAR,
      height: responsiveScreenHeight(8),
      padding: responsiveScreenWidth(3),
      width: responsiveScreenWidth(67),
    },
    reportSubmit: {
      display: 'flex',
      alignSelf: 'flex-end',
      marginTop: responsiveScreenHeight(2),
    },
    reportBtn: {
      paddingHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1),
      borderRadius: responsiveScreenWidth(2),
      backgroundColor: Colors.Primary,
      width: responsiveScreenWidth(30),
    },
    reportBtnText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      textAlign: 'center',
    },
  });
