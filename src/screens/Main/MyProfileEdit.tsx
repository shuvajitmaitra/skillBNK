import React, {useRef, useReducer} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  ImageBackground,
} from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';
import {
  pick,
  types,
  DocumentPickerResponse,
} from '@react-native-documents/picker';
import {
  launchImageLibrary,
  Asset,
  ImagePickerResponse,
  ImageLibraryOptions,
} from 'react-native-image-picker';

import CustomFonts from '../../constants/CustomFonts';
import {useDispatch, useSelector} from 'react-redux';
import {formatDate} from '../../utility/formatDate';
import MyButton from '../../components/AuthenticationCom/MyButton';
import {useTheme} from '../../context/ThemeContext';
import axiosInstance from '../../utility/axiosInstance';
import FacebookSvg from '../../assets/Icons/FacebookSvg';
import InstagramIcon from '../../assets/Icons/InstagramIcon';
import Linkedin from '../../assets/Icons/Linkedin';
import Twitter from '../../assets/Icons/Twitter';
import GithubIcon from '../../assets/Icons/GithubIcon';
import {setUser} from '../../store/reducer/authReducer';
import UploadIcon from '../../assets/Icons/UploadIcon';
import {extractFileName, showToast} from '../../components/HelperFunction';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import RequireFieldStar from '../../constants/RequireFieldStar';
import ArrowLeft from '../../assets/Icons/ArrowLeft';
import CameraIcon from '../../assets/Icons/CameraIcon';
import {RootState} from '../../types/redux/root';
import {HomeStackParamList} from '../../types/navigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {TColors} from '../../types';
import {borderRadius, fontSizes, gGap, gHeight} from '../../constants/Sizes';
import CustomDropDown from '../../components/SharedComponent/CustomDropDown';
import {replaceSpaceWithDash, theme} from '../../utility/commonFunction';

interface EditProfileState {
  firstName: string;
  lastName: string;
  about: string;
  facebook: string;
  github: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  selectedPostalCode: string;
  selectedCountry: string;
  selectedCity: string;
  addressState: string; // Previously "state"
  street: string; // Previously "selectedState"
  resume: string;
  resumeName: string;
  isLoading: boolean;
  profilePicture: string;
  gender?: string;
  education?: string;
}

type EditProfileAction =
  | {type: 'SET_FIELD'; field: keyof EditProfileState; value: string | boolean}
  | {type: 'SET_MULTIPLE_FIELDS'; payload: Partial<EditProfileState>};

function reducer(
  state: EditProfileState,
  action: EditProfileAction,
): EditProfileState {
  switch (action.type) {
    case 'SET_FIELD':
      return {...state, [action.field]: action.value};
    case 'SET_MULTIPLE_FIELDS':
      return {...state, ...action.payload};
    default:
      return state;
  }
}

export default function MyProfileEdit() {
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({animated: true});
  };

  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {user} = useSelector((state: RootState) => state.auth);
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const reduxDispatch = useDispatch();
  const {top} = useSafeAreaInsets();

  // Consolidated state via useReducer
  const initialState: EditProfileState = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    about: user?.about || '',
    facebook: user?.personalData?.socialMedia?.facebook || '',
    github: user?.personalData?.socialMedia?.github || '',
    instagram: user?.personalData?.socialMedia?.instagram || '',
    linkedin: user?.personalData?.socialMedia?.linkedin || '',
    twitter: user?.personalData?.socialMedia?.twitter || '',
    selectedPostalCode: user?.personalData?.address?.postalCode || '',
    selectedCountry: user?.personalData?.address?.country || '',
    selectedCity: user?.personalData?.address?.city || '',
    addressState: user?.personalData?.address?.state || '',
    street: user?.personalData?.address?.street || '',
    resume: user?.personalData?.resume || '',
    resumeName: '',
    isLoading: false,
    profilePicture: user?.profilePicture || '',
    gender: user.gender || '',
  };

  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const handleCancel = () => {
    navigation.pop(2);
  };
  const handleUpdateUser = () => {
    // Required fields validation
    if (!formState.firstName?.trim()) {
      return showToast({
        message: 'First name is required',
        background: Colors.Red,
      });
    }
    if (!formState.lastName?.trim()) {
      return showToast({
        message: 'Last name is required',
        background: Colors.Red,
      });
    }
    if (!formState.about?.trim()) {
      return showToast({
        message: 'Bio is required',
        background: Colors.Red,
      });
    }

    // Optional fields whitespace validation
    const optionalFields = {
      street: formState.street,
      city: formState.selectedCity,
      postalCode: formState.selectedPostalCode,
      country: formState.selectedCountry,
      facebook: formState.facebook,
      github: formState.github,
      instagram: formState.instagram,
      linkedin: formState.linkedin,
      twitter: formState.twitter,
      resume: formState.resume,
    };

    for (const [field, value] of Object.entries(optionalFields)) {
      if (value && !value.trim()) {
        return showToast({
          message: `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } cannot be only whitespace`,
          background: Colors.Red,
        });
      }
    }

    axiosInstance
      .patch('/user/updateuser', {
        firstName: formState.firstName,
        lastName: formState.lastName,
        personalData: {
          address: {
            street: formState.street?.trim() || '',
            city: formState.selectedCity?.trim() || '',
            postalCode: formState.selectedPostalCode?.trim() || '',
            state: formState.addressState?.trim() || '',
            country: formState.selectedCountry?.trim() || '',
          },
          socialMedia: {
            facebook: formState.facebook?.trim() || '',
            github: formState.github?.trim() || '',
            instagram: formState.instagram?.trim() || '',
            linkedin: formState.linkedin?.trim() || '',
            twitter: formState.twitter?.trim() || '',
          },
          resume: formState.resume?.trim() || '',
          bio: formState.about,
        },
        about: formState.about,
        gender: formState.gender,
      })
      .then(res => {
        navigation.pop(2);
        showToast({
          message: 'Profile has been updated successfully!!',
        });

        reduxDispatch(setUser(res.data.user));
      })
      .catch(err => {
        console.log('editProfile', err);
      });
  };
  const uploadResume = async () => {
    try {
      const [result]: DocumentPickerResponse[] = await pick({
        allowMultiSelection: false,
        type: types.pdf,
      });

      console.log('result', JSON.stringify(result, null, 2));
      dispatchFormState({type: 'SET_FIELD', field: 'isLoading', value: true});
      const {uri, name: n} = result;
      const name = replaceSpaceWithDash(n || '');
      dispatchFormState({
        type: 'SET_FIELD',
        field: 'resumeName',
        value: name || '',
      });
      const formData = new FormData();
      formData.append('file', {
        uri,
        name,
        type: 'application/pdf',
      });
      const url = '/document/userdocumentfile';
      const response = await axiosInstance.post(url, formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });

      console.log('response', JSON.stringify(response, null, 2));
      if (response?.data?.success) {
        scrollToBottom();
        dispatchFormState({
          type: 'SET_MULTIPLE_FIELDS',
          payload: {resume: response.data.fileUrl, isLoading: false},
        });
      } else {
        dispatchFormState({
          type: 'SET_FIELD',
          field: 'isLoading',
          value: false,
        });
      }
    } catch (error: any) {
      dispatchFormState({type: 'SET_FIELD', field: 'isLoading', value: false});
      if (error?.response) {
        console.error('Server error:', error.response.data);
      } else if (error?.request) {
        console.error('Network error:', error.request);
      } else {
        showToast({message: 'Cancel resume picker'});
      }
    }
  };

  const saveImage = async (mediaData: Asset) => {
    // Update profile image preview immediately
    dispatchFormState({
      type: 'SET_FIELD',
      field: 'profilePicture',
      value: mediaData.uri || '',
    });
    try {
      dispatchFormState({type: 'SET_FIELD', field: 'isLoading', value: true});
      const formData = new FormData();
      const data = {
        uri: mediaData.uri,
        name: mediaData.fileName || 'profile_image',
        fileName: mediaData.fileName || 'profile_image',
        type: mediaData.type || 'image',
      };
      formData.append('image', data);

      axiosInstance
        .patch('/user/updateimage', formData, {
          headers: {'Content-Type': 'multipart/form-data'},
        })
        .then(res => {
          if (res.data.success) {
            navigation.navigate('MyProfile');
            showToast({message: 'Profile picture changed'});
            reduxDispatch(setUser(res.data.user));
            dispatchFormState({
              type: 'SET_FIELD',
              field: 'isLoading',
              value: false,
            });
          } else {
            dispatchFormState({
              type: 'SET_FIELD',
              field: 'isLoading',
              value: false,
            });
          }
        })
        .catch(error => {
          dispatchFormState({
            type: 'SET_FIELD',
            field: 'isLoading',
            value: false,
          });
          if (error.response) {
            console.log(
              'Server error:',
              JSON.stringify(error.response.data, null, 1),
            );
          } else if (error.request) {
            console.log(
              'Network error:',
              JSON.stringify(error.request, null, 1),
            );
          } else {
            console.error('Error:', JSON.stringify(error.message, null, 1));
          }
        });
    } catch (error: any) {
      dispatchFormState({type: 'SET_FIELD', field: 'isLoading', value: false});
      if (error.response) {
        console.log(
          'Server error:',
          JSON.stringify(error.response.data.error, null, 1),
        );
      } else if (error.request) {
        console.log('Network error:', JSON.stringify(error.request, null, 1));
      } else {
        console.error('Error:', JSON.stringify(error.message, null, 1));
      }
    }
  };

  const selectImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo' as const,
      maxWidth: 30000,
      maxHeight: 30000,
      quality: 1,
      selectionLimit: 1,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        saveImage(response.assets[0]);
      }
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
      <View style={{backgroundColor: Colors.Background_color}}>
        <StatusBar barStyle={'light-content'} backgroundColor={'transparent'} />
        <ScrollView ref={scrollViewRef} contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.container}>
            <View style={[styles.topContainer, {paddingTop: top}]}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.topArrowContainer}>
                <ArrowLeft color={Colors.PureWhite} />
                <Text style={styles.topText}>Back</Text>
              </TouchableOpacity>
              <Text style={styles.myProfile}>Edit Profile</Text>
              <View style={{flex: 0.3, height: 10}} />
            </View>
            <ImageBackground
              source={require('../../assets/ApplicationImage/MainPage/MyProfileBG5.png')}
              style={styles.bgimg}>
              <View
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
                {formState.isLoading && (
                  <View
                    style={{
                      position: 'absolute',
                      zIndex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <ActivityIndicator color={Colors.Primary} size={40} />
                  </View>
                )}
                <Image
                  source={{uri: formState.profilePicture}}
                  style={styles.profileImg}
                />
                <TouchableOpacity
                  onPress={selectImage}
                  style={styles.photoIconContainer}>
                  <CameraIcon />
                </TouchableOpacity>
              </View>
            </ImageBackground>

            <Text style={styles.profileName}>{user?.fullName}</Text>
            <Text style={styles.profileId}>ID: {user?.id}</Text>

            <Text style={styles.personalInfo}>Personal Information</Text>

            {/* First Name */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldText}>
                First Name
                <RequireFieldStar />
              </Text>
              <TextInput
                keyboardAppearance={theme()}
                numberOfLines={1}
                style={styles.textInput}
                onChangeText={text =>
                  dispatchFormState({
                    type: 'SET_FIELD',
                    field: 'firstName',
                    value: text,
                  })
                }
                value={formState.firstName}
                placeholder="Enter first name..."
                placeholderTextColor={Colors.BodyText}
                autoCapitalize="words"
              />
            </View>

            {/* Last Name */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldText}>
                Last Name
                <RequireFieldStar />
              </Text>
              <TextInput
                keyboardAppearance={theme()}
                numberOfLines={1}
                style={styles.textInput}
                value={formState.lastName}
                onChangeText={text =>
                  dispatchFormState({
                    type: 'SET_FIELD',
                    field: 'lastName',
                    value: text,
                  })
                }
                placeholder="Enter last name..."
                placeholderTextColor={Colors.BodyText}
                autoCapitalize="words"
              />
            </View>

            {/* Email */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldText}>
                Email
                <Text
                  style={{
                    fontSize: fontSizes.small,
                    fontFamily: CustomFonts.REGULAR,
                    color: Colors.Red,
                  }}>
                  {' '}
                  (Not editable)
                </Text>
              </Text>
              <TextInput
                keyboardAppearance={theme()}
                numberOfLines={1}
                style={styles.textInput}
                placeholder={user?.email || 'Enter email...'}
                placeholderTextColor={Colors.BodyText}
                editable={false}
              />
            </View>

            {/* Member Since */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldText}>
                Member Since
                <Text
                  style={{
                    fontSize: fontSizes.small,
                    fontFamily: CustomFonts.REGULAR,
                    color: Colors.Red,
                  }}>
                  {' '}
                  (Not editable)
                </Text>
              </Text>
              <TextInput
                keyboardAppearance={theme()}
                numberOfLines={1}
                style={styles.textInput}
                placeholder={formatDate(user?.createdAt)}
                editable={false}
                placeholderTextColor={Colors.BodyText}
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={[styles.fieldText, {marginBottom: gGap(5)}]}>
                Gender
              </Text>
              <CustomDropDown
                options={[
                  {data: 'male', type: 'Male'},
                  {data: 'female', type: 'Female'},
                  {data: 'other', type: 'Other'},
                  {data: 'prefer-not-to-say', type: 'Prefer not to say'},
                ]}
                type={
                  user.gender === 'male'
                    ? 'Male'
                    : user.gender === 'female'
                    ? 'Female'
                    : user.gender === 'other'
                    ? 'Other'
                    : user.gender === 'prefer-not-to-say'
                    ? 'Prefer not to say'
                    : 'Select gender'
                }
                setState={t => {
                  dispatchFormState({
                    type: 'SET_FIELD',
                    field: 'gender',
                    value: t,
                  });
                }}
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={[styles.fieldText, {marginBottom: gGap(5)}]}>
                Education
              </Text>
              <CustomDropDown
                options={[
                  {data: 'highschool', type: 'High School'},
                  {data: 'bachelors', type: "Bachelor's"},
                  {data: 'masters', type: "Master's"},
                  {data: 'phd', type: 'PhD'},
                ]}
                type={
                  user?.education === 'highschool'
                    ? 'High School'
                    : user?.education === 'bachelors'
                    ? "Bachelor's"
                    : user?.education === 'masters'
                    ? "Master's"
                    : user?.education === 'phd'
                    ? 'PhD'
                    : 'Select education'
                }
                setState={t => {
                  dispatchFormState({
                    type: 'SET_FIELD',
                    field: 'education',
                    value: t,
                  });
                }}
              />
            </View>

            {/* Resume */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldText}>Resume</Text>
              <TouchableOpacity
                onPress={uploadResume}
                style={styles.resumeContainer}>
                <UploadIcon />
                <Text numberOfLines={1} style={styles.downloadFile}>
                  {formState.resumeName ||
                    extractFileName(formState.resume) ||
                    'Upload Document'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Address & Social Links */}
            <View style={styles.cont}>
              {/* Address */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldText}>Address</Text>
                <View style={styles.addressContainer}>
                  <TextInput
                    keyboardAppearance={theme()}
                    // numberOfLines={1}
                    placeholder="Enter street"
                    value={formState.street}
                    style={styles.addressInput}
                    onChangeText={text =>
                      dispatchFormState({
                        type: 'SET_FIELD',
                        field: 'street',
                        value: text,
                      })
                    }
                    placeholderTextColor={Colors.BodyText}
                    autoCapitalize="words"
                  />
                  <TextInput
                    keyboardAppearance={theme()}
                    numberOfLines={1}
                    placeholder="Enter city"
                    style={styles.addressInput}
                    onChangeText={text =>
                      dispatchFormState({
                        type: 'SET_FIELD',
                        field: 'selectedCity',
                        value: text,
                      })
                    }
                    value={formState.selectedCity}
                    placeholderTextColor={Colors.BodyText}
                    autoCapitalize="words"
                  />

                  <TextInput
                    keyboardAppearance={theme()}
                    numberOfLines={1}
                    placeholder="Enter postal code"
                    placeholderTextColor={Colors.BodyText}
                    value={formState.selectedPostalCode}
                    style={styles.addressInput}
                    onChangeText={text =>
                      dispatchFormState({
                        type: 'SET_FIELD',
                        field: 'selectedPostalCode',
                        value: text,
                      })
                    }
                    keyboardType="numeric"
                  />

                  <TextInput
                    keyboardAppearance={theme()}
                    numberOfLines={1}
                    placeholder="Enter country"
                    value={formState.selectedCountry}
                    style={styles.addressInput}
                    placeholderTextColor={Colors.BodyText}
                    onChangeText={text =>
                      dispatchFormState({
                        type: 'SET_FIELD',
                        field: 'selectedCountry',
                        value: text,
                      })
                    }
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Social Links */}
              <View style={styles.socialfieldContainer}>
                <Text style={styles.fieldText}>Social Link</Text>
                <View style={styles.socialLinkContainer}>
                  <View style={[styles.socialInputContainer]}>
                    <View style={styles.socialIconContainer}>
                      <FacebookSvg />
                    </View>
                    <TextInput
                      keyboardAppearance={theme()}
                      numberOfLines={1}
                      placeholder="www.facebook.com"
                      placeholderTextColor={Colors.BodyText}
                      style={styles.socialInputField}
                      onChangeText={text =>
                        dispatchFormState({
                          type: 'SET_FIELD',
                          field: 'facebook',
                          value: text,
                        })
                      }
                      value={formState.facebook}
                      keyboardType="url"
                      autoCapitalize="none"
                    />
                  </View>
                  <View style={[styles.socialInputContainer]}>
                    <View style={styles.socialIconContainer}>
                      <GithubIcon />
                    </View>
                    <TextInput
                      keyboardAppearance={theme()}
                      numberOfLines={1}
                      placeholder="www.github.com"
                      placeholderTextColor={Colors.BodyText}
                      value={formState.github}
                      style={styles.socialInputField}
                      onChangeText={text =>
                        dispatchFormState({
                          type: 'SET_FIELD',
                          field: 'github',
                          value: text,
                        })
                      }
                      keyboardType="url"
                      autoCapitalize="none"
                    />
                  </View>
                  <View style={[styles.socialInputContainer]}>
                    <View style={styles.socialIconContainer}>
                      <InstagramIcon />
                    </View>
                    <TextInput
                      keyboardAppearance={theme()}
                      numberOfLines={1}
                      placeholder="www.instagram.com"
                      placeholderTextColor={Colors.BodyText}
                      value={formState.instagram}
                      style={styles.socialInputField}
                      onChangeText={text =>
                        dispatchFormState({
                          type: 'SET_FIELD',
                          field: 'instagram',
                          value: text,
                        })
                      }
                      keyboardType="url"
                      autoCapitalize="none"
                    />
                  </View>
                  <View style={[styles.socialInputContainer]}>
                    <View style={styles.socialIconContainer}>
                      <Linkedin />
                    </View>
                    <TextInput
                      keyboardAppearance={theme()}
                      numberOfLines={1}
                      placeholder="www.linkedin.com"
                      placeholderTextColor={Colors.BodyText}
                      value={formState.linkedin}
                      style={styles.socialInputField}
                      onChangeText={text =>
                        dispatchFormState({
                          type: 'SET_FIELD',
                          field: 'linkedin',
                          value: text,
                        })
                      }
                      keyboardType="url"
                      autoCapitalize="none"
                    />
                  </View>
                  <View style={styles.socialInputContainer}>
                    <View style={styles.socialIconContainer}>
                      <Twitter />
                    </View>
                    <TextInput
                      keyboardAppearance={theme()}
                      numberOfLines={1}
                      placeholder="www.twitter.com"
                      placeholderTextColor={Colors.BodyText}
                      value={formState.twitter}
                      style={styles.socialInputField}
                      onChangeText={text =>
                        dispatchFormState({
                          type: 'SET_FIELD',
                          field: 'twitter',
                          value: text,
                        })
                      }
                      keyboardType="url"
                      autoCapitalize="none"
                    />
                  </View>
                </View>
              </View>

              {/* Bio */}
              <View style={styles.bioContainer}>
                <Text style={styles.fieldText}>
                  Bio
                  <RequireFieldStar />
                </Text>
                <TextInput
                  keyboardAppearance={theme()}
                  multiline
                  onFocus={scrollToBottom}
                  placeholderTextColor={Colors.BodyText}
                  placeholder={'Write about yourself'}
                  style={styles.textAreaInput}
                  onChangeText={text =>
                    dispatchFormState({
                      type: 'SET_FIELD',
                      field: 'about',
                      value: text,
                    })
                  }
                  value={formState.about}
                  editable
                  maxLength={200}
                  autoCapitalize="sentences"
                />
              </View>
            </View>

            {/* Buttons */}
            <View>
              <View style={styles.btnArea}>
                <MyButton
                  title={'Cancel'}
                  bg={Colors.SecondaryButtonBackgroundColor}
                  colour={Colors.SecondaryButtonTextColor}
                  onPress={handleCancel}
                />
                <MyButton
                  title={'Update'}
                  bg={Colors.Primary}
                  colour={Colors.PureWhite}
                  onPress={handleUpdateUser}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    addressInput: {
      backgroundColor: Colors.Background_color,
      borderRadius: borderRadius.default,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      paddingHorizontal: gGap(10),
      color: Colors.BodyText,
      paddingVertical: gGap(15),
    },
    socialIconContainer: {
      width: '15%',
      alignItems: 'center',
      backgroundColor: Colors.Foreground,
      height: gHeight(40),
      justifyContent: 'center',
    },
    socialInputField: {
      color: Colors.Heading,
      fontFamily: CustomFonts.REGULAR,
    },
    socialInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: 7,
      backgroundColor: Colors.Background_color,
      overflow: 'hidden',
      gap: Platform.OS === 'android' ? gGap(5) : gGap(10),
    },
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
    },
    topContainer: {
      flexDirection: 'row',
      position: 'absolute',
      zIndex: 1,
      paddingHorizontal: responsiveScreenWidth(3),
      justifyContent: 'space-between',
      width: responsiveScreenWidth(100),
      alignItems: 'flex-end',
    },
    topArrowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 0.3,
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
      flex: 0.3,
      textAlign: 'center',
    },
    photoIconContainer: {
      width: gGap(30),
      height: gGap(30),
      backgroundColor: Colors.Foreground,
      borderRadius: responsiveScreenWidth(7),
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      bottom: 0,
      right: 0,
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
      marginBottom: responsiveScreenHeight(1),
    },
    socialfieldContainer: {
      width: responsiveScreenWidth(90),
      alignSelf: 'center',
      marginTop: responsiveScreenHeight(2.5),
      marginBottom: responsiveScreenHeight(1),
    },
    bioContainer: {
      width: responsiveScreenWidth(90),
      alignSelf: 'center',
      marginTop: responsiveScreenHeight(2.5),
      marginBottom: responsiveScreenHeight(1),
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
      height: responsiveScreenHeight(6),
      backgroundColor: Colors.Foreground,
      borderRadius: 10,
      borderWidth: 1,
      marginTop: responsiveScreenHeight(1),
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: responsiveScreenWidth(2),
      borderColor: Colors.BorderColor,
    },
    addressContainer: {
      width: responsiveScreenWidth(90),
      backgroundColor: Colors.Foreground,
      borderRadius: 10,
      borderWidth: 1,
      gap: responsiveScreenHeight(1.5),
      marginTop: responsiveScreenHeight(1),
      paddingVertical: responsiveScreenHeight(1.5),
      paddingHorizontal: responsiveScreenWidth(2),
      borderColor: Colors.BorderColor,
    },
    socialLinkContainer: {
      width: responsiveScreenWidth(90),
      gap: responsiveScreenHeight(1.5),
      backgroundColor: Colors.Foreground,
      borderRadius: 10,
      borderWidth: 1,
      marginTop: responsiveScreenHeight(1),
      paddingVertical: responsiveScreenHeight(1.5),
      paddingHorizontal: responsiveScreenWidth(2.5),
      borderColor: Colors.BorderColor,
    },
    textInput: {
      width: '100%',
      // marginLeft: gGap(1),
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
      fontFamily: CustomFonts.REGULAR,
      overflow: 'scroll',
      backgroundColor: Colors.Foreground,
      paddingLeft: 10,
      borderRadius: 7,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      height: 50,
      marginTop: gGap(5),
    },
    textAreaInput: {
      color: Colors.Heading,
      fontFamily: CustomFonts.REGULAR,
      backgroundColor: Colors.Foreground,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      width: '100%',
      paddingHorizontal: gGap(10),
      paddingVertical: gGap(10),
      borderRadius: borderRadius.default,
      marginTop: gGap(5),
      minHeight: gGap(100),
    },
    resumeContainer: {
      width: responsiveScreenWidth(90),
      height: gGap(45),
      borderRadius: 10,
      borderWidth: 1,
      marginTop: gGap(5),
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: gGap(15),
      borderColor: Colors.Primary,
    },
    downloadFile: {
      color: Colors.Primary,
      marginLeft: gGap(10),
      flexBasis: '80%',
      fontFamily: CustomFonts.SEMI_BOLD,
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
    },
    dropdownArea: {
      width: responsiveScreenWidth(85),
      height: responsiveScreenHeight(16),
      borderRadius: responsiveScreenWidth(3),
      marginTop: responsiveScreenHeight(0),
      backgroundColor: Colors.Foreground,
      alignSelf: 'center',
      position: 'absolute',
      top: 420,
      zIndex: 5,
      paddingVertical: responsiveScreenHeight(1),
      borderColor: Colors.BorderColor,
      borderWidth: 1,
    },
    dropdownStateArea: {
      width: responsiveScreenWidth(85),
      height: responsiveScreenHeight(16),
      borderRadius: responsiveScreenWidth(3),
      marginTop: responsiveScreenHeight(0),
      backgroundColor: Colors.Foreground,
      alignSelf: 'center',
      position: 'absolute',
      top: 280,
      zIndex: 4,
      paddingVertical: responsiveScreenHeight(1),
      borderColor: Colors.BorderColor,
      borderWidth: 1,
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
    lineUp: {
      marginLeft: responsiveScreenWidth(2),
    },
    socialField: {width: '100%', paddingLeft: responsiveScreenWidth(2)},
  });
