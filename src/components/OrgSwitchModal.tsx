import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import ReactNativeModal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from '../context/ThemeContext';
import CustomFonts from '../constants/CustomFonts';
import Divider from './SharedComponent/Divider';
import Images from '../constants/Images';
import {setOrganization} from '../utility/mmkvHelpers';
import {setSelectedOrganization} from '../store/reducer/authReducer';
import {useMainContext} from '../context/MainContext';
import {RootState} from '../types/redux/root';
import {TColors} from '../types';
import {TOrganization} from '../types/auth/auth';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';

const OrgSwitchModal = ({isVisible = false, onCancelPress = () => {}}) => {
  const {organizations, selectedOrganization} = useSelector(
    (state: RootState) => state.auth,
  );

  const {handleVerify2} = useMainContext();
  const dispatch = useDispatch();
  const Colors = useTheme();

  const styles = getStyles(Colors);
  useEffect(() => {
    const handleSelectOrganization = () => {
      if (organizations.length === 0) {
        return;
      }
      setOrganization(organizations[0]);
      dispatch(setSelectedOrganization(organizations[0]));
      handleVerify2();
    };
    if (organizations.length === 1) {
      handleSelectOrganization();
    }
  }, [dispatch, handleVerify2, organizations]);

  const handleSelectOrganization = (org: TOrganization) => {
    setOrganization(org);
    dispatch(setSelectedOrganization(org));
    handleVerify2();
  };

  const renderItem = ({item}: {item: TOrganization}) => {
    return (
      <View key={item?._id} style={styles.selectedOrganizationContainer}>
        <Image
          source={
            item?.data?.companyLogo
              ? {uri: item.data.companyLogo}
              : Images.DEFAULT_IMAGE
          }
          resizeMode="contain"
          style={styles.selectedOrganizationImage}
        />
        <Text style={styles.selectedOrganizationText}>
          {item?.name || 'N/A'}
        </Text>
        <View style={{flexGrow: 1}} />
        <TouchableOpacity
          onPress={() => handleSelectOrganization(item)}
          style={styles.selectBtnContainer}>
          <Text style={{color: Colors.PrimaryButtonTextColor}}>
            {item._id === selectedOrganization?._id ? 'Selected' : 'Select'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const renderSeparator = () => {
    return <Divider marginTop={0.5} marginBottom={0.5} />;
  };
  return (
    <ReactNativeModal isVisible={isVisible} onBackdropPress={onCancelPress}>
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headingText}>Select Company/University</Text>
        </View>
        <Divider marginTop={1} marginBottom={1} />
        <FlatList
          data={organizations || []}
          renderItem={renderItem}
          keyExtractor={item => item._id.toString()}
          ItemSeparatorComponent={renderSeparator}
        />
      </View>
    </ReactNativeModal>
  );
};

export default OrgSwitchModal;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    selectBtnContainer: {
      backgroundColor: Colors.PrimaryButtonBackgroundColor,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 4,
    },
    headingText: {
      fontSize: 20,
      fontWeight: '700',
      fontFamily: CustomFonts.BOLD,
      color: Colors.Heading,
    },
    mainContainer: {
      backgroundColor: Colors.Foreground,
      borderRadius: 10,
      padding: 10,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    selectedOrganizationImage: {
      borderRadius: 100,
      backgroundColor: Colors.Primary,
      height: 30,
      width: 30,
    },
    selectedOrganizationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      width: '100%',
    },
    selectedOrganizationText: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.MEDIUM,
      maxWidth: '70%',
      // backgroundColor: 'red',
    },
  });
