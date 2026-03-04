import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {RootState} from '../../types/redux/root';
import {useSelector} from 'react-redux';
import {AntDesignIcon, FeatherIcon} from '../../constants/Icons';
import CustomProgressbar from '../SharedComponent/CustomProgressbar';
import {TColors} from '../../types';
import {useTheme} from '../../context/ThemeContext';
import Divider2 from '../SharedComponent/Divider2';
import {borderRadius, fontSizes, gGap} from '../../constants/Sizes';
import CustomFonts from '../../constants/CustomFonts';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
// import {timeFromNow} from '../../utility/commonFunction';
import moment from 'moment';

// Define types for user data
interface Address {
  country?: string;
  city?: string;
  street?: string;
  postalCode?: string;
  state?: string;
}

interface SocialMedia {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  github?: string;
}

interface PersonalData {
  address?: Address;
  socialMedia?: SocialMedia;
  resume?: string;
  bio?: string;
}

interface ProfileStatus {
  recurring?: {
    isDailyRecurring?: boolean;
    fromTime?: string;
    toTime?: string;
  };
  currentStatus?: string;
}

interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  gender?: string;
  about?: string;
  personalData?: PersonalData;
  profilePicture?: string;
  updatedAt?: string;
  lastPasswordChange?: string;
  profileStatus?: ProfileStatus;
  [key: string]: any; // For other properties we might access
}

export function ProfileCart() {
  const {user} = useSelector((state: RootState) => state.auth);
  const [profileCompletion, setProfileCompletion] = useState<number>(0);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // Type-safe user access
  const typedUser = user as User | undefined;

  useEffect(() => {
    calculateProfileCompletion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate profile completion percentage based on filled user fields
  const calculateProfileCompletion = () => {
    if (!typedUser) {
      return;
    }

    let totalFields = 0;
    let completedFields = 0;

    // Basic info checks
    const basicInfoFields: Array<keyof User> = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'gender',
      'about',
    ];
    totalFields += basicInfoFields.length;
    basicInfoFields.forEach(field => {
      if (typedUser[field] && String(typedUser[field]).trim()) {
        completedFields++;
      }
    });

    // Address checks
    if (typedUser.personalData && typedUser.personalData.address) {
      const addressFields: Array<keyof Address> = [
        'country',
        'city',
        'street',
        'postalCode',
        'state',
      ];
      totalFields += addressFields.length;
      addressFields.forEach(field => {
        if (
          typedUser.personalData?.address &&
          typedUser.personalData.address[field] &&
          String(typedUser.personalData.address[field]).trim()
        ) {
          completedFields++;
        }
      });
    }

    // Social media checks
    if (typedUser.personalData && typedUser.personalData.socialMedia) {
      const socialFields: Array<keyof SocialMedia> = [
        'facebook',
        'twitter',
        'linkedin',
        'instagram',
        'github',
      ];
      totalFields += socialFields.length;
      socialFields.forEach(field => {
        if (
          typedUser.personalData?.socialMedia &&
          typedUser.personalData.socialMedia[field] &&
          String(typedUser.personalData.socialMedia[field]).trim()
        ) {
          completedFields++;
        }
      });
    }

    // Profile picture check
    totalFields += 1;
    if (typedUser.profilePicture) {
      completedFields += 1;
    }

    // Bio check
    totalFields += 1;
    if (typedUser.personalData?.bio && typedUser.personalData.bio.trim()) {
      completedFields += 1;
    }

    // Resume check
    totalFields += 1;
    if (
      typedUser.personalData?.resume &&
      typedUser.personalData.resume.trim()
    ) {
      completedFields += 1;
    }

    const completion = Math.round((completedFields / totalFields) * 100);
    setProfileCompletion(completion);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Profile</Text>
      <Divider2 marginTop={gGap(10)} />
      {/* profile section */}
      <View style={styles.sectionHeader}>
        <View style={styles.iconContainer}>
          <FeatherIcon name="user" size={16} color="#6366f1" />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>
            {user.fullName || 'Unavailable'}
          </Text>
          <Text style={styles.completionText}>
            {`${profileCompletion}% complete`}
          </Text>
        </View>
      </View>
      <CustomProgressbar progress={profileCompletion} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: gGap(10),
          marginVertical: gGap(10),
        }}>
        <FeatherIcon name="clock" size={18} color={Colors.BodyText} />
        <Text style={styles.lastUpdatedText}>
          Last updated {moment(user.updatedAt).fromNow()}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('HomeStack', {screen: 'MyProfile'})}>
        <Text style={styles.buttonText}>
          {profileCompletion < 100 ? 'Complete Profile' : 'View Profile'}
        </Text>
        <AntDesignIcon name="arrowright" size={20} color={Colors.BodyText} />
      </TouchableOpacity>

      {/* Change password section */}
      <View style={[styles.sectionHeader, {marginTop: gGap(10)}]}>
        <View style={styles.iconContainer}>
          <FeatherIcon name="key" size={16} color="#6366f1" />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Change Password </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: gGap(10),
          marginVertical: gGap(10),
        }}>
        <FeatherIcon name="clock" size={18} color={Colors.BodyText} />
        <Text style={styles.lastUpdatedText}>
          Last updated {moment(user.lastPasswordChange).fromNow()}
          {/* {moment(moment(user.lastPasswordChange).toLocaleString()).fromNow()} */}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('HomeStack', {screen: 'ChangePasswordScreen'})
        }>
        <Text style={styles.buttonText}>Change Now </Text>
        <AntDesignIcon name="arrowright" size={20} color={Colors.BodyText} />
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: Colors.Foreground,
    },
    cardHeader: {
      padding: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
      marginBottom: 8,
    },
    cardTitle: {
      fontSize: fontSizes.subHeading,
      fontWeight: '600',
      color: Colors.Heading,
    },
    cardSubtitle: {
      fontSize: 12,
      color: '#6B7280',
    },

    contentGrid: {
      gap: 16,
    },
    ProfileCart: {
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: '#e5e7eb',
      marginBottom: 16,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
    },
    iconContainer: {
      width: 32,
      height: 32,
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
    },
    sectionTitle: {
      fontSize: fontSizes.subHeading,
      fontWeight: '500',
      color: Colors.Heading,
    },
    completionText: {
      fontSize: fontSizes.small,
      color: Colors.BodyText,
      backgroundColor: Colors.Background_color,
      paddingHorizontal: gGap(10),
      paddingVertical: gGap(4),
      borderRadius: borderRadius.circle,
    },
    lastUpdatedText: {
      fontSize: fontSizes.body,
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
    },
    button: {
      backgroundColor: Colors.SecondaryButtonBackgroundColor,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 4,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      gap: gGap(10),
    },
    buttonText: {
      fontSize: 12,
      color: Colors.SecondaryButtonTextColor,
      fontWeight: '500',
    },
    buttonIcon: {
      marginLeft: 4,
    },
    lastPasswordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 8,
      marginBottom: 16,
    },
    lastPasswordText: {
      fontSize: 12,
      color: '#6B7280',
    },
  });
