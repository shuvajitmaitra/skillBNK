import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axiosInstance from '../../utility/axiosInstance';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import DrawerIcon from '../../assets/Icons/DrawerIcon';
import {useNavigation} from '@react-navigation/native';
import LandingPageBanner from '../../assets/Icons/LandingPageBanner';
import {Linking} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../context/ThemeContext';
import BootCampsList from '../../components/LandingCom/BootCampsList';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {theme} from '../../utility/commonFunction';

const LandingScreenMain = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const navigation = useNavigation();
  const {top} = useSafeAreaInsets();

  const [type, setType] = useState('program');
  const [loading, setIsLoading] = useState(false);
  const [company, setCompany] = useState({});
  const [branches, setBranches] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const slug = 'Tech-Serve4-U-LLC';
  const getCompanyDetails = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/organization/details/${slug}`);
      setCompany(res.data.company);
      setBranches(res.data.branches);
      setTotalCount(res.data.studentCount);
    } catch (error) {
      console.log('Error fetching company details:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCompanyDetails();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const companyUrl = company?.data?.companyUrl;
  const twitterUrl = company?.data?.twitter;
  const facebookUrl = company?.data?.facebook;
  const youtubeUrl = company?.data?.youtube;

  const openWebsite = url => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const handleProgramsType = option => {
    setType(option);
  };

  return (
    <View style={[styles.container, {paddingTop: top}]}>
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.headingContainer}>
              <StatusBar
                translucent={true}
                backgroundColor={Colors.Background_color}
                barStyle={
                  theme() === 'light' ? 'dark-content' : 'light-content'
                }
              />
              <View style={styles.drawerContainer}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                  <DrawerIcon />
                </TouchableOpacity>
              </View>
              <View style={styles.bannerContainer}>
                <LandingPageBanner />
              </View>
              <Text style={styles.pageTitle}>{company?.name}</Text>
              <Text style={styles.subTitle}>Online Education Platform</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => handleProgramsType('course')}
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        type === 'course' ? Colors.Primary : Colors.BodyText,
                    },
                  ]}>
                  <Text style={styles.buttonText}>Online Courses</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleProgramsType('program')}
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        type === 'program'
                          ? Colors.Primary
                          : Colors.Background_color,
                    },
                  ]}>
                  <Text style={styles.buttonText}>Bootcamps</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.countContainer}>
                <View>
                  <Text style={styles.countTitleText}>Total Students</Text>
                  <Text style={styles.countText}>{totalCount || 0}</Text>
                </View>
                <View style={styles.verticalLine} />
                <View>
                  <Text style={styles.countTitleText}>Branches</Text>
                  <Text style={styles.countText}>{branches?.length || 0}</Text>
                </View>
              </View>
              <View style={styles.iconContainer}>
                {companyUrl && (
                  <TouchableOpacity
                    style={styles.socialIcon}
                    onPress={() => openWebsite(companyUrl)}>
                    <Feather name="link-2" size={24} color={Colors.Primary} />
                  </TouchableOpacity>
                )}

                {twitterUrl && (
                  <TouchableOpacity
                    style={styles.socialIcon}
                    onPress={() => openWebsite(twitterUrl)}>
                    <FontAwesome
                      name="twitter"
                      size={24}
                      color={Colors.Primary}
                    />
                  </TouchableOpacity>
                )}
                {facebookUrl && (
                  <TouchableOpacity
                    style={styles.socialIcon}
                    onPress={() => openWebsite(facebookUrl)}>
                    <FontAwesome
                      name="facebook-f"
                      size={24}
                      color={Colors.Primary}
                    />
                  </TouchableOpacity>
                )}
                {youtubeUrl && (
                  <TouchableOpacity
                    style={styles.socialIcon}
                    onPress={() => openWebsite(youtubeUrl)}>
                    <Feather name="youtube" size={24} color={Colors.Primary} />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.aboutTitleText}>About Us</Text>
              <Text style={styles.aboutText}>{company?.data?.about}</Text>
            </View>
          </>
        }
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => <BootCampsList type={type} />}
      />
    </View>
  );
};

export default LandingScreenMain;

const getStyles = Colors =>
  StyleSheet.create({
    searchButton: {
      backgroundColor: Colors.Primary,
      padding: 10,
      borderRadius: 6,
    },
    searchInput: {
      backgroundColor: Colors.Background_color,
      paddingVertical: 8,
      paddingLeft: 10,
      borderRadius: 6,
      flex: 0.95,
    },
    branchSearchInput: {
      backgroundColor: Colors.Background_color,
      paddingVertical: 8,
      paddingLeft: 10,
      borderRadius: 6,
      flex: 0.45,
      position: 'relative',
    },
    bootCampsSearchInput: {
      backgroundColor: Colors.Background_color,
      paddingVertical: 8,
      paddingLeft: 10,
      borderRadius: 6,
      flex: 0.45,
    },
    onlineSearchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: Colors.PrimaryOpacityColor,
      borderColor: Colors.Primary,
      borderRadius: 10,
      borderWidth: 1,
      overflow: 'hidden',
      paddingVertical: 10,
      paddingLeft: 15,
      paddingRight: 10,
    },
    bootCampSearchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: Colors.PrimaryOpacityColor,
      borderColor: Colors.Primary,
      borderRadius: 10,
      borderWidth: 1,
      overflow: 'hidden',
      paddingVertical: 10,
      paddingLeft: 15,
      paddingRight: 10,
    },
    bootCampsTitle: {
      fontSize: responsiveScreenFontSize(3.8),
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      marginTop: 60,
      marginBottom: 30,
    },
    aboutText: {
      fontSize: responsiveScreenFontSize(1.9),
      textAlign: 'center',
      lineHeight: 30,
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
    },
    aboutTitleText: {
      fontSize: responsiveScreenFontSize(3.8),
      textAlign: 'center',
      fontFamily: CustomFonts.SEMI_BOLD,
      marginTop: 60,
      marginBottom: 30,
      color: Colors.Heading,
    },
    iconContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 15,
      marginTop: 30,
    },
    socialIcon: {
      height: 46,
      width: 46,
      borderRadius: 50,
      borderColor: Colors.Primary,
      borderWidth: 1,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
    },
    verticalLine: {
      backgroundColor: Colors.LineColor,
      width: 2,
    },
    countText: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2.9),
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    countTitleText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
    },
    countContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 20,
      marginTop: 30,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 30,
    },
    buttonText: {
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
    },
    button: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 13,
      borderRadius: 50,
      // gap: 5,
      alignItems: 'center',
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.Primary,
    },
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
    },
    drawerContainer: {
      marginTop: responsiveScreenHeight(1.5),
      marginBottom: 10,
    },
    bannerContainer: {
      marginTop: 10,
      alignItems: 'center',
    },
    pageTitle: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(4.5),
      textAlign: 'center',
      marginTop: 50,
      fontFamily: CustomFonts.SEMI_BOLD,
      marginBottom: 20,
    },
    subTitle: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(2.5),
      textAlign: 'center',
      fontFamily: CustomFonts.REGULAR,
    },
    headingContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
  });
