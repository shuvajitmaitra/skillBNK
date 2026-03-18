import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Pressable,
  ScrollView,
  ImageBackground,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import environment from '../constants/environment';
import {useTheme} from '../context/ThemeContext';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import CustomFonts from '../constants/CustomFonts';
import useUserStatusData from '../constants/UserStatusData';
import HomeIconTwo from '../assets/Icons/HomeIcon2';
import ProfileGreenIcon from '../assets/Icons/ProfileGreenIcon';
import MyProgramIcon from '../assets/Icons/MyProgramIcon';
import DocumentIcon from '../assets/Icons/DocumentIcon';
import PasswordIcon from '../assets/Icons/PasswordIcon';
import DisplaySettingsIcon from '../assets/Icons/DisplaySettingsIcon';
import OrganizationDetails from '../navigation/OrganizationDetails';
import {showToast} from '../components/HelperFunction';
import {RootState} from '../types/redux/root';
import Images from '../constants/Images';
import {handleSignOut} from '../utility/commonFunction';
import {fontSizes, gGap} from '../constants/Sizes';
import BinIcon from '../assets/Icons/BinIcon';
import ConfirmationModal from '../components/SharedComponent/ConfirmationModal';
import {getFromMMKV} from '../utility/mmkvHelpers';
import DrawerItem from './DrawerItem';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {navigate, replace} from '../navigation/NavigationService';
import store from '../store';
import {toggleDrawer} from '../store/reducer/authReducer';
import RNText from '../components/SharedComponent/RNText';
import {EntypoIcon, IoniconsIcon, OcticonsIcon} from '../constants/Icons';

interface TColors {
  color: string;
  size: number;
}

const MIcon = MaterialIcons as any;
const Icon = MaterialCommunityIcons as any;

const renderHomeIconTwo = ({color, size}: TColors) => (
  <HomeIconTwo color={color} size={size} />
);
const renderProfileGreenIcon = ({color, size}: TColors) => (
  <ProfileGreenIcon color={color} size={size} />
);
const renderMyProgramIcon = ({color, size}: TColors) => (
  <MyProgramIcon color={color} size={size} />
);
// const renderBookIcon = ({color, size}: TColors) => (
//   <BookIcon color={color} size={size} />
// );
const renderDocumentIcon = ({color, size}: TColors) => (
  <DocumentIcon color={color} size={size} />
);
const renderUploadedDocumentIcon = ({color, size}: TColors) => (
  <IoniconsIcon name="document-attach-outline" color={color} size={size} />
);
const renderDocumentLabsIcon = ({color, size}: TColors) => (
  <EntypoIcon name="documents" color={color} size={size} />
);
const renderTemplateIcon = ({color, size}: TColors) => (
  <OcticonsIcon name="repo-template" color={color} size={size} />
);
const renderPasswordIcon = ({color, size}: TColors) => (
  <PasswordIcon color={color} size={size} />
);
const renderDisplaySettingsIcon = ({color, size}: TColors) => (
  <DisplaySettingsIcon color={color} size={size} />
);
const renderSystemUpdateAltIcon = ({color, size}: TColors) => (
  <MIcon name="system-update-alt" color={color} size={size} />
);
const renderExitToAppIcon = ({color, size}: TColors) => (
  <Icon name="exit-to-app" color={color} size={size} />
);

export function DrawerContent(props: any) {
  const [navigationData, setNavigationData] = useState<any[]>([]);
  const {top} = useSafeAreaInsets();

  useEffect(() => {
    const data = getFromMMKV('navigationData');
    setNavigationData(Array.isArray(data) ? data : []);
  }, []);

  const hasMenu = (menuId: string) =>
    navigationData.some((m: any) => m.id === menuId);

  const hasProgram =
    hasMenu('my-program') ||
    hasMenu('portal-audio-video-sending') ||
    hasMenu('portal-template') ||
    hasMenu('portal-diagram') ||
    hasMenu('leaderboard');

  const hasChangePassword = hasMenu('change-password');
  const hasMyProfile = hasMenu('my-profile');
  const hasDocuments =
    hasMenu('portal-document-sending') ||
    hasMenu('portal-user-uploaded-documents') ||
    hasMenu('portal-documents-and-labs') ||
    hasMenu('portal-slide') ||
    hasMenu('portal-template');

  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {user} = useSelector((state: RootState) => state.auth);
  const {updateInfo} = useSelector((state: RootState) => state.ota);
  const {status} = useSelector((state: RootState) => state.userStatus);
  const userStatusData = useUserStatusData(16);
  const [confiramModalVisible, setConfiramModalVisible] = useState(false);
  const navigateToScreen = (stack: string, screen: string) => {
    store.dispatch(toggleDrawer());
    replace('BottomTabNavigator', {
      screen: stack,
      params: {
        screen: screen,
      },
    });
  };

  return (
    <View
      style={{flex: 1, backgroundColor: Colors.Foreground, paddingTop: top}}>
      <ScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <Pressable
              onPress={() => navigateToScreen('HomeStack', 'MyProfile')}
              style={{
                flexDirection: 'row',
                marginTop: gGap(15),
              }}>
              <ImageBackground
                source={Images.DEFAULT_IMAGE}
                style={{
                  width: 50,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: Colors.BorderColor,
                  borderRadius: 100,
                  overflow: 'hidden',
                }}
                imageStyle={{
                  borderRadius: 25,
                }}>
                <Image
                  source={
                    user.profilePicture
                      ? {
                          uri: user?.profilePicture,
                        }
                      : Images.DEFAULT_IMAGE
                  }
                  style={{width: 50, height: 50, borderRadius: 25}}
                />
              </ImageBackground>
              <View
                style={{
                  position: 'absolute',
                  bottom: -5,
                  left: 32,
                  backgroundColor: Colors.Foreground,
                  borderRadius: 100,
                  padding: 2,
                }}>
                {userStatusData.find(item => item.value === status)?.icon}
              </View>
              <View style={{marginLeft: 15, flexDirection: 'column', flex: 1}}>
                <Text style={styles.title}>{user?.fullName}</Text>
                <Text style={styles.caption}>{user?.email}</Text>
              </View>
            </Pressable>
          </View>
          {hasProgram && <OrganizationDetails />}
          <View style={styles.drawerSection}>
            <DrawerItem
              icon={renderHomeIconTwo}
              label="Home"
              labelStyle={{
                fontFamily: CustomFonts.MEDIUM,
                color: Colors.Heading,
                marginLeft: responsiveScreenWidth(-1),
              }}
              onPress={() => navigateToScreen('HomeStack', 'Home')}
            />

            {hasMyProfile && (
              <DrawerItem
                icon={renderProfileGreenIcon}
                label="Profile"
                labelStyle={{
                  fontFamily: CustomFonts.MEDIUM,
                  color: Colors.Heading,
                }}
                onPress={() => navigateToScreen('HomeStack', 'MyProfile')}
              />
            )}

            {hasProgram && (
              <DrawerItem
                icon={renderMyProgramIcon}
                label="Bootcamps"
                labelStyle={{
                  fontFamily: CustomFonts.MEDIUM,
                  color: Colors.Heading,
                }}
                onPress={() => navigateToScreen('ProgramStack', 'Program')}
              />
            )}
            {/*
            <DrawerItem
              icon={() => renderBookIcon({color: Colors.Heading, size: 24})}
              label="Technical Tests"
              labelStyle={{
                fontFamily: CustomFonts.MEDIUM,
                color: Colors.Heading,
              }}
              onPress={() =>
                navigateToScreen('ProgramStack', 'TechnicalTestScreen')
              }
            /> */}
            {hasDocuments && (
              <DrawerItem
                icon={renderDocumentIcon}
                label="My Documents"
                labelStyle={{
                  fontFamily: CustomFonts.MEDIUM,
                  color: Colors.Heading,
                }}
                onPress={() =>
                  navigateToScreen('ProgramStack', 'MyDocumentsScreen')
                }
              />
            )}
            {hasDocuments && (
              <DrawerItem
                icon={renderUploadedDocumentIcon}
                label="Uploaded Documents"
                labelStyle={{
                  fontFamily: CustomFonts.MEDIUM,
                  color: Colors.Heading,
                }}
                onPress={() =>
                  navigateToScreen('ProgramStack', 'UploadedDocumentsScreen')
                }
              />
            )}
            {hasDocuments && (
              <DrawerItem
                icon={renderDocumentLabsIcon}
                label="Documents and Labs"
                labelStyle={{
                  fontFamily: CustomFonts.MEDIUM,
                  color: Colors.Heading,
                }}
                onPress={() =>
                  navigateToScreen('ProgramStack', 'DocumentsLabsScreen')
                }
              />
            )}
            {hasDocuments && (
              <DrawerItem
                icon={renderTemplateIcon}
                label="Templates"
                labelStyle={{
                  fontFamily: CustomFonts.MEDIUM,
                  color: Colors.Heading,
                }}
                onPress={() =>
                  navigateToScreen('ProgramStack', 'TemplatesScreen')
                }
              />
            )}

            {hasChangePassword && (
              <DrawerItem
                icon={renderPasswordIcon}
                label="Change Password"
                labelStyle={{
                  fontFamily: CustomFonts.MEDIUM,
                  color: Colors.Heading,
                }}
                onPress={() =>
                  navigateToScreen('HomeStack', 'ChangePasswordScreen')
                }
              />
            )}

            <DrawerItem
              icon={renderDisplaySettingsIcon}
              label="Display Settings"
              labelStyle={{
                fontFamily: CustomFonts.MEDIUM,
                color: Colors.Heading,
              }}
              onPress={() =>
                navigateToScreen('HomeStack', 'DisplaySettingsScreen')
              }
            />
            {/*
            {updateAvailable ? (
              <DrawerItem
                icon={() => (
                  <MIcon name="system-update-alt" color={'red'} size={19} />
                )}
                label="Download Update"
                labelStyle={{
                  fontFamily: CustomFonts.MEDIUM,
                  color: 'red',
                }}
                onPress={() => {
                  onDownloadUpdateAsync();
                }}
              />
            ) : (
            )} */}
            <DrawerItem
              icon={() =>
                renderSystemUpdateAltIcon({color: Colors.Heading, size: 20})
              }
              label="Check for Update"
              labelStyle={{
                fontFamily: CustomFonts.MEDIUM,
                color: Colors.Heading,
              }}
              onPress={() => {
                // onCheckGitVersion();
                // navigation.navigate('OtaScreen');
                if (updateInfo?.url) store.dispatch(toggleDrawer());
                updateInfo?.url
                  ? navigate('OtaScreen')
                  : showToast({message: 'No update available'});
              }}
            />
            {
              <DrawerItem
                // eslint-disable-next-line react/no-unstable-nested-components
                icon={() => <BinIcon color={Colors.Red} size={24} />}
                label="Clear updates"
                labelStyle={{
                  fontFamily: CustomFonts.MEDIUM,
                  color: Colors.Red,
                  fontSize: fontSizes.body,
                }}
                onPress={() => {
                  setConfiramModalVisible(!confiramModalVisible);

                  // hotUpdate.git.removeGitUpdate();
                  // hotUpdate.resetApp();
                }}
              />
            }
          </View>
        </View>
        <ConfirmationModal
          title="Delete Updates!"
          description="Do you want to delete recent OTA updates?"
          isVisible={confiramModalVisible}
          cancelPress={() => {
            setConfiramModalVisible(!confiramModalVisible);
          }}
          okPress={() => {
            setConfiramModalVisible(!confiramModalVisible);
            // hotUpdate.git.removeGitUpdate();
            // hotUpdate.resetApp();
          }}
        />
      </ScrollView>

      <DrawerItem
        icon={() => renderExitToAppIcon({color: 'red', size: 20})}
        label="Sign Out"
        onPress={handleSignOut}
        labelStyle={{
          fontFamily: CustomFonts.SEMI_BOLD,
          color: 'red',
        }}
      />

      <RNText
        style={{
          paddingLeft: 20,
          paddingBottom: 20,
          color: Colors.Heading,
          fontFamily: CustomFonts.MEDIUM,
        }}>
        Version: {environment.version} {!environment.production && '(staging)'}
      </RNText>
    </View>
  );
}

const getStyles = (Colors: {[key: string]: string}) =>
  StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    title: {
      fontSize: 16,
      marginTop: 3,
      lineHeight: 20,
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    caption: {
      fontSize: 12,
      lineHeight: 14,
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      // marginTop: 15,
    },
    bottomDrawerSection: {
      marginBottom: 15,
      // Additional styling if needed
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });
