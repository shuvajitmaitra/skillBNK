import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform,
  ImageBackground,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';

import CustomFonts from '../../constants/CustomFonts';
import EditIcon from '../../assets/Icons/EditIcon';

import {useSelector} from 'react-redux';
import FacebookIcon from '../../assets/Icons/FacebookIcon';
import InstragramIcon from '../../assets/Icons/InstragramIcon';
import LinkedInIcon from '../../assets/Icons/LinkedInIcon';
import {formatDate} from '../../utility/formatDate';
import {useTheme} from '../../context/ThemeContext';
import DownloadIconTwo from '../../assets/Icons/DownloadIconTwo';
import {extractFileName, handleOpenLink} from '../../components/HelperFunction';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Images from '../../constants/Images';
import {RegularFonts} from '../../constants/Fonts';
import ArrowLeft from '../../assets/Icons/ArrowLeft';
import Twitter from '../../assets/Icons/Twitter';
import GithubIcon2 from '../../assets/Icons/GithubIcon2';
import {RootState} from '../../types/redux/root';
import {TColors} from '../../types';
import {RootStackParamList} from '../../types/navigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import TextRender from '../../components/SharedComponent/TextRender';
import {borderRadius, gGap, gHeight} from '../../constants/Sizes';
import {theme} from '../../utility/commonFunction';
import ImageView from 'react-native-image-viewing';

export default function MyProfile() {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {user} = useSelector((state: RootState) => state.auth);
  const [viewImage, setViewImage] = useState<{uri: string}[] | []>([]);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // console.log('user', JSON.stringify(user, null, 2));
  const {top} = useSafeAreaInsets();
  const isVerified = user.isEmailVerified.status;
  console.log('user', JSON.stringify(user, null, 2));
  return (
    <View style={{backgroundColor: Colors.Background_color}}>
      <StatusBar backgroundColor={'transparent'} barStyle={'light-content'} />
      <ScrollView>
        <View style={styles.container}>
          <View style={[styles.topContainer, {paddingTop: top}]}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={[styles.topArrowContainer]}>
              <ArrowLeft color={Colors.PureWhite} />
              <Text style={styles.topText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.myProfile}>My Profile</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('MyProfileEdit')}
              style={styles.editIcon}>
              <EditIcon />
            </TouchableOpacity>
          </View>
          <ImageBackground
            source={require('../../assets/ApplicationImage/MainPage/MyProfileBG5.png')}
            style={styles.bgimg}>
            <Pressable
              onPress={() => {
                user.profilePicture &&
                  setViewImage([{uri: user.profilePicture}]);
              }}
              style={{
                position: 'absolute',
                height: gGap(80),
                width: gGap(80),
                backgroundColor: Colors.Background_color,
                bottom: gGap(-20),
                borderRadius: borderRadius.circle,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={
                  user.profilePicture
                    ? {uri: user?.profilePicture}
                    : Images.DEFAULT_IMAGE
                }
                style={styles.profileImg}
              />
            </Pressable>
          </ImageBackground>

          <Text style={styles.profileName}>{user?.fullName}</Text>
          <Text style={styles.profileId}>ID: {user?.id}</Text>
          <View style={styles.socialIcon}>
            {user.personalData.socialMedia.facebook ? (
              <TouchableOpacity
                onPress={() => {
                  handleOpenLink(user?.personalData?.socialMedia?.facebook);
                }}>
                <FacebookIcon color={Colors.Primary} />
              </TouchableOpacity>
            ) : null}
            {user?.personalData?.socialMedia?.github ? (
              <TouchableOpacity
                onPress={() => {
                  handleOpenLink(user?.personalData?.socialMedia?.github);
                }}>
                {/* <GithubIconTwo /> */}
                <GithubIcon2 color={Colors.Primary} size={27} />
              </TouchableOpacity>
            ) : null}
            {user?.personalData?.socialMedia?.instagram ? (
              <TouchableOpacity
                onPress={() => {
                  handleOpenLink(user?.personalData?.socialMedia?.instagram);
                }}>
                <InstragramIcon color={Colors.Primary} />
              </TouchableOpacity>
            ) : null}
            {user?.personalData?.socialMedia?.linkedin ? (
              <TouchableOpacity
                onPress={() => {
                  handleOpenLink(user?.personalData?.socialMedia?.linkedin);
                }}>
                <LinkedInIcon color={Colors.Primary} />
              </TouchableOpacity>
            ) : null}
            {user?.personalData?.socialMedia?.twitter ? (
              <TouchableOpacity
                onPress={() => {
                  handleOpenLink(user?.personalData?.socialMedia?.twitter);
                }}>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 50,
                    borderWidth: 1,
                    overflow: 'hidden',
                    borderColor: Colors.Primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Twitter color={Colors.Primary} />
                </View>
              </TouchableOpacity>
            ) : null}
          </View>

          <Text style={styles.personalInfo}>Personal Information</Text>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldText}>First Name</Text>
            <View style={[styles.inputContainer]}>
              <TextInput
                keyboardAppearance={theme()}
                style={styles.textInput}
                numberOfLines={1}
                placeholder={user?.firstName || 'N/A'}
                placeholderTextColor={Colors.BodyText}
                editable={false}
              />
            </View>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldText}>Last Name</Text>
            <View style={[styles.inputContainer]}>
              <TextInput
                keyboardAppearance={theme()}
                style={styles.textInput}
                numberOfLines={1}
                placeholder={user?.lastName || 'N/A'}
                placeholderTextColor={Colors.BodyText}
                editable={false}
              />
            </View>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldText}>
              Email Address{' '}
              <Text style={{color: isVerified ? 'green' : 'red'}}>
                {isVerified ? '(Verified)' : '(Unverified)'}
              </Text>
            </Text>
            <View style={[styles.inputContainer]}>
              <TextInput
                keyboardAppearance={theme()}
                style={styles.textInput}
                numberOfLines={1}
                placeholder={user?.email || 'N/A'}
                placeholderTextColor={Colors.BodyText}
                editable={false}
              />
            </View>
          </View>
          {/* <CustomePhoneField title="Phone Number" setText={setPhone} /> */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldText}>
              Phone{' '}
              <Text style={{fontFamily: CustomFonts.MEDIUM, color: Colors.Red}}>
                {user?.phone.isVerified ? '(Verify Now)' : '(Not Verified)'}
              </Text>
            </Text>
            <View
              style={[
                styles.inputContainer,
                {
                  borderColor: user?.phone.isVerified
                    ? Colors.BorderColor
                    : Colors.Red,
                },
              ]}>
              <TextInput
                keyboardAppearance={theme()}
                style={styles.textInput}
                numberOfLines={1}
                placeholder={
                  user?.phone?.number && user?.phone?.countryCode
                    ? '+' + user?.phone?.countryCode + user?.phone?.number
                    : 'N/A'
                }
                editable={false}
                placeholderTextColor={Colors.BodyText}
              />
            </View>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldText}>Member Since</Text>
            <View style={[styles.inputContainer]}>
              <TextInput
                keyboardAppearance={theme()}
                style={styles.textInput}
                numberOfLines={1}
                placeholder={formatDate(user?.createdAt)}
                editable={false}
                placeholderTextColor={Colors.BodyText}
              />
            </View>
          </View>
          {Boolean(user.gender) && (
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldText}>Gender</Text>
              <View style={[styles.inputContainer]}>
                <Text
                  style={{
                    textTransform: 'capitalize',
                    marginLeft: responsiveScreenWidth(1),
                    fontSize: responsiveScreenFontSize(1.8),
                    color: Colors.Heading,
                    fontFamily: CustomFonts.REGULAR,
                  }}>
                  {user?.gender}
                </Text>
              </View>
            </View>
          )}
          {Boolean(user.education) && (
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldText}>Education</Text>
              <View style={[styles.inputContainer]}>
                <Text
                  style={{
                    textTransform: 'capitalize',
                    marginLeft: responsiveScreenWidth(1),
                    fontSize: responsiveScreenFontSize(1.8),
                    color: Colors.Heading,
                    fontFamily: CustomFonts.REGULAR,
                  }}>
                  {user?.education}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldText}>Resume</Text>
            <TouchableOpacity
              onPress={() => {
                user?.personalData?.resume
                  ? handleOpenLink(user?.personalData?.resume)
                  : Alert.alert('Resume not available');
              }}
              style={styles.resumeContainer}>
              <DownloadIconTwo />
              <Text numberOfLines={1} style={styles.downloadFile}>
                {extractFileName(user?.personalData?.resume || '') ||
                  'Resume not available'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cont}>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldText}>Address</Text>
              <View style={styles.addressContainer}>
                <View style={[styles.selectContainer]}>
                  <Text style={styles.addressText}>
                    {user?.personalData?.address?.street || 'Street'}
                  </Text>
                </View>
                <View style={[styles?.selectContainer]}>
                  <Text style={styles?.addressText}>
                    {user?.personalData?.address?.city || 'City'}
                  </Text>
                </View>
                <View style={[styles?.selectContainer]}>
                  <Text style={styles?.addressText}>
                    {user?.personalData?.address?.postalCode || 'Postal code'}
                  </Text>
                </View>
                {/* <View style={[styles?.selectContainer]}>
                  <Text style={styles?.addressText}>
                    {user?.personalData?.address?.state || "State"}
                  </Text>
                </View> */}
                <View style={[styles?.selectContainer]}>
                  <Text style={styles?.addressText}>
                    {user?.personalData?.address?.country || 'Country'}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.bioContainer}>
              <Text style={styles.fieldText}>Bio</Text>
              <View
                style={[
                  // styles.inputContainer,
                  {
                    height: 'auto',
                    minHeight: gHeight(100),
                    backgroundColor: Colors.Foreground,
                    paddingHorizontal: gGap(10),
                    marginTop: gGap(5),
                    borderWidth: 1,
                    borderColor: Colors.BorderColor,
                    borderRadius: borderRadius.default,
                  },
                ]}>
                {/* <TextInput
                  keyboardAppearance={
                    Colors.Background_color === "#F5F5F5" ? "light" : "dark"
                  }
                  style={[styles.textAreaInput]}
                  multiline={true}
                  onChangeText={setDescription}
                  placeholderTextColor={Colors.BodyText}
                  placeholder={
                    "Write a brief bio to help others get to know you..."
                  }
                  value={user?.about}
                  editable={false}
                /> */}
                {/* <Markdown style={styles.markdownStyle as MarkdownStylesProps}>
                  {autoLinkify(user?.about)}
                </Markdown> */}
                <TextRender text={user?.about || 'test'} />
              </View>
            </View>
          </View>
          {viewImage?.length !== 0 && (
            <ImageView
              images={viewImage}
              imageIndex={0}
              visible={viewImage?.length !== 0}
              onRequestClose={() => setViewImage([])}
            />
          )}
          {/* <View style={{ marginBottom: responsiveScreenHeight(2) }}></View> */}
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
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
        fontFamily: CustomFonts.MEDIUM,
        lineHeight: 24,
        textAlign: 'justify',
        marginBottom: responsiveScreenHeight(1.5),
        // backgroundColor: "yellow",
        minHeight: 100,
        fontSize: RegularFonts.BR,
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
        // marginBottom: 100,
        textDecorationLine: 'none',
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

    container: {
      flex: 1,
      // marginTop: responsiveScreenHeight(3),
      backgroundColor: Colors.Background_color,
    },
    topContainer: {
      flexDirection: 'row',
      position: 'absolute',
      zIndex: 1,
      paddingHorizontal: responsiveScreenWidth(3),
      paddingVertical: responsiveScreenHeight(1),
      marginTop: responsiveScreenHeight(1),
      justifyContent: 'space-between',
      width: responsiveScreenWidth(100),
      alignItems: 'center',
      // backgroundColor: "red",
    },
    topArrowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    arrowStyle: {
      // marginTop: responsiveScreenHeight(0.3),
    },
    editIcon: {
      marginTop: responsiveScreenHeight(0.4),
    },
    topText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(2),
      marginLeft: responsiveScreenWidth(1),
    },
    bgimg: {
      width: '100%',
      height: gHeight(250),
      objectFit: 'contain',
      alignItems: 'center',
      justifyContent: 'center',
    },
    profileImgContainer: {
      width: responsiveScreenWidth(25),
      height: responsiveScreenWidth(25),
      backgroundColor: Colors.Foreground,
      borderRadius: responsiveScreenWidth(25),
      position: 'absolute',
      left: responsiveScreenWidth(36),
      top: responsiveScreenHeight(21),
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileImg: {
      width: gGap(80),
      height: gGap(80),
      objectFit: 'cover',
      borderRadius: borderRadius.circle,
      borderWidth: 5,
      borderColor: Colors.PureWhite,
    },
    myProfile: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(2),
      marginRight: responsiveScreenWidth(12),
    },
    photoIconContainer: {
      width: responsiveScreenWidth(7),
      height: responsiveScreenWidth(7),
      backgroundColor: Colors.Foreground,
      borderRadius: responsiveScreenWidth(7),
      position: 'absolute',
      left: responsiveScreenWidth(19),
      top: responsiveScreenHeight(6.5),
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileName: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      alignSelf: 'center',
      marginTop: responsiveScreenHeight(4.5),
      color: Colors.Heading,
    },
    profileId: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
      alignSelf: 'center',
      marginTop: responsiveScreenHeight(0),
      color: Colors.BodyText,
    },
    socialIcon: {
      alignSelf: 'center',
      flexDirection: 'row',
      gap: responsiveScreenWidth(2),
      marginTop: responsiveScreenHeight(1),
      // backgroundColor: 'blue',
    },

    personalInfo: {
      width: responsiveScreenWidth(90),
      alignSelf: 'center',
      marginVertical: responsiveScreenHeight(2),
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.2),
      color: Colors.Heading,
    },

    fieldContainer: {
      width: responsiveScreenWidth(90),
      alignSelf: 'center',
      marginBottom: gGap(10),
    },

    bioContainer: {
      width: responsiveScreenWidth(90),
      alignSelf: 'center',
      marginTop: responsiveScreenHeight(1),
      marginBottom: responsiveScreenHeight(2.5),
      position: 'static',

      zIndex: 1,
    },
    fieldText: {
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.8),
      marginLeft: 2,
    },
    inputContainer: {
      width: responsiveScreenWidth(90),
      height: gHeight(45),
      backgroundColor: Colors.Foreground,
      borderRadius: 10,
      borderWidth: 1,
      overflow: 'hidden',
      marginTop: gHeight(5),
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Platform.OS === 'android' ? gGap(5) : gGap(10),
      borderColor: Colors.BorderColor,
    },
    addressContainer: {
      width: responsiveScreenWidth(90),
      backgroundColor: Colors.Foreground,
      borderRadius: 10,
      borderWidth: 1,
      overflow: 'hidden',
      gap: responsiveScreenHeight(1.5),
      marginTop: responsiveScreenHeight(1),
      paddingVertical: responsiveScreenHeight(1.5),
      paddingHorizontal: responsiveScreenWidth(2),
      borderColor: Colors.BorderColor,
    },
    addressText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.9),
      textTransform: 'capitalize',
    },
    selectContainer: {
      flex: 1,
      height: responsiveScreenHeight(6),
      borderRadius: 10,
      borderWidth: 1,
      overflow: 'hidden',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: responsiveScreenWidth(3),
      justifyContent: 'space-between',
      borderColor: Colors.BorderColor,
      backgroundColor: Colors.Background_color,
    },
    textInput: {
      width: '100%',
      marginLeft: responsiveScreenWidth(1),
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
      fontFamily: CustomFonts.REGULAR,
      textAlign: 'justify',
      // backgroundColor: "red",
      flex: 1,
    },
    textAreaInput: {
      marginLeft: responsiveScreenWidth(1),
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
      fontFamily: CustomFonts.REGULAR,
      textAlign: 'justify',
      paddingVertical: responsiveScreenHeight(1),
      textAlignVertical: 'top',
      minHeight: responsiveScreenHeight(10),
    },
    resumeContainer: {
      width: responsiveScreenWidth(90),
      height: responsiveScreenHeight(6),

      borderRadius: 10,
      borderWidth: 1,
      overflow: 'hidden',
      marginTop: responsiveScreenHeight(1),
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: responsiveScreenWidth(4),
      borderColor: Colors.Primary,
    },
    resumeImage: {
      width: responsiveScreenWidth(6),
      height: responsiveScreenWidth(6),
    },
    downloadFile: {
      color: Colors.Primary,
      marginLeft: responsiveScreenWidth(2),
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.8),
      flexBasis: '80%',
    },
    btnArea: {
      flexDirection: 'row',
      paddingHorizontal: responsiveScreenWidth(5),
      gap: responsiveScreenWidth(3),
      marginVertical: responsiveScreenHeight(2),
    },
    dropdownCityArea: {
      width: responsiveScreenWidth(85),
      height: responsiveScreenHeight(16),
      borderRadius: responsiveScreenWidth(3),
      marginTop: responsiveScreenHeight(0),
      backgroundColor: Colors.Foreground,

      alignSelf: 'center',
      position: 'absolute',
      top: 210,
      zIndex: 9,
      paddingVertical: responsiveScreenHeight(1),
      borderColor: Colors.BorderColor,
      borderWidth: 1,
      overflow: 'hidden',
    },
    dropdownArea: {
      width: responsiveScreenWidth(85),
      height: responsiveScreenHeight(16),
      borderRadius: responsiveScreenWidth(3),
      marginTop: responsiveScreenHeight(0),
      backgroundColor: Colors.Foreground,

      alignSelf: 'center',
      position: 'absolute',
      top: 72,
      zIndex: 3,
      paddingVertical: responsiveScreenHeight(1),
      borderColor: Colors.BorderColor,
      borderWidth: 1,
      overflow: 'hidden',
    },
    dropdownStateArea: {
      width: responsiveScreenWidth(85),
      height: responsiveScreenHeight(16),
      borderRadius: responsiveScreenWidth(3),
      marginTop: responsiveScreenHeight(0),
      backgroundColor: Colors.Foreground,

      alignSelf: 'center',
      position: 'absolute',
      top: 143,
      zIndex: 4,
      paddingVertical: responsiveScreenHeight(1),
      borderColor: Colors.BorderColor,
      borderWidth: 1,
      overflow: 'hidden',
    },
    searchInput: {
      width: responsiveScreenWidth(80),
      height: responsiveScreenHeight(4),
      borderWidth: responsiveScreenWidth(0.3),
      borderColor: Colors.BorderColor,
      borderRadius: responsiveScreenWidth(3),
      alignSelf: 'center',
      marginTop: responsiveScreenHeight(0.5),
      paddingLeft: responsiveScreenWidth(3),
      color: Colors.Heading,
    },
    cont: {
      position: 'relative',
    },
    countryItem: {
      width: responsiveScreenWidth(75),
      height: responsiveScreenHeight(3),
      borderBottomWidth: 0.2,
      borderBottomColor: '#8e8e8e',
      alignSelf: 'center',
      justifyContent: 'center',
    },
    country: {
      flexDirection: 'row',

      gap: 225,
      alignItems: 'center',
    },
    countryName: {
      color: Colors.Heading,
    },
  });
