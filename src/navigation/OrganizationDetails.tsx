// src/components/OrganizationDetails.tsx
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import Images from '../constants/Images';
import {useTheme} from '../context/ThemeContext';

import {RootState} from '../types/redux/root';
import {TColors} from '../types';
import {TOrganization} from '../types/auth/auth';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import {fontSizes, gGap} from '../constants/Sizes';

export interface OrganizationData {
  email: string;
  postalAddress: string;
  companyUrl: string;
  phone: string;
  faxNumber: string;
  taxNumber: string;
  contactPerson: string;
  companyLogo: string;
  companyDocument: string;
  otherDocument: string;
  about: string;
  facebook: string;
  twitter: string;
  youtube: string;
}

export interface Organization {
  data: OrganizationData;
  _id: string;
  name: string;
  slug: string;
}

const OrganizationDetails: React.FC = () => {
  const {organizations, selectedOrganization} = useSelector(
    (state: RootState) => state.auth,
  );

  const Colors: TColors = useTheme();
  const styles = getStyles(Colors);
  if (!selectedOrganization) return;

  return (
    <View style={{paddingHorizontal: 16}}>
      <Text
        style={{
          fontSize: fontSizes.body,
          fontWeight: '600',
          color: Colors.Heading,
          marginBottom: gGap(5),
          marginTop: gGap(10),
        }}>
        Organizations
      </Text>
      <View
        style={{
          gap: gGap(10),
          backgroundColor: Colors.Background_color,
          paddingVertical: gGap(10),

          borderRadius: gGap(10),
        }}>
        {organizations?.map((item: TOrganization) => (
          <View key={item._id} style={[styles.selectedOrganizationContainer]}>
            <Image
              source={
                item?.data?.companyLogo
                  ? {uri: item.data.companyLogo}
                  : Images.DEFAULT_IMAGE
              }
              resizeMode="contain"
              style={styles.selectedOrganizationImage}
            />
            <Text style={styles.itemText}>{item.name}</Text>

            {/* {item._id === selectedOrganization?._id && (
              <View style={[styles.selectBtnContainer]}>
                <Text style={styles.selectBtnText}>Selected</Text>
              </View>
            )} */}
          </View>
        ))}
      </View>
    </View>
  );
};

export default OrganizationDetails;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    topContainer: {
      backgroundColor: Colors.Background_color,
      paddingVertical: 5,
      marginTop: 10,
      borderRadius: 5,
    },
    selectBtnText: {
      color: Colors.DisablePrimaryButtonTextColor,
    },
    selectBtnContainer: {
      backgroundColor: Colors.DisablePrimaryBackgroundColor,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 4,
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
      // backgroundColor: 'blue',
      paddingHorizontal: 10,
      gap: 5,
      flex: 1,
    },
    selectedOrganizationText: {
      color: Colors.Heading,
      fontWeight: '600',
      fontSize: responsiveScreenFontSize(2),
      width: '80%',
    },
    itemText: {
      // backgroundColor: 'red',
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.8),
      flex: 1,
    },
    animatedDropdown: {
      // paddingHorizontal: 20,
      marginTop: 10,
      gap: 10,
    },
  });
