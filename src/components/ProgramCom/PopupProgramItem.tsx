import React from 'react';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenWidth,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';

import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';
import {IEnrollment} from '../../types/enrollments/enrollments';
import {borderRadius, fontSizes, gGap} from '../../constants/Sizes';
import {TColors} from '../../types';
import RNText from '../SharedComponent/RNText';

// Define an interface for the enrollment data used by this component.
export interface Enrollment {
  _id: string;
  program?: {
    title: string;
    type: string;

    // Add other fields if needed.
  };
  session?: {
    name: string;
    // Add other fields if needed.
  };
  organization?: {
    name: string;
    // Add other fields if needed.
  };
  status: string;
}

// Define the component props interface.
interface PopupProgramItemProps {
  enrollment: IEnrollment;
  handleSwitch: (enrollment: any) => void;
  active: IEnrollment | null;
}

export default function PopupProgramItem({
  enrollment,
  handleSwitch,
  active,
}: PopupProgramItemProps) {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{enrollment?.program?.title}</Text>
      </View>
      <View>
        <View style={styles.sessionContainer}>
          <Text style={styles.sessionText}>Session:</Text>
          <Text style={styles.sessionDate}>{enrollment?.session?.name}</Text>
        </View>
        <View style={styles.sessionContainer}>
          <Text style={styles.sessionText}>Company:</Text>
          <Text style={styles.sessionDate}>
            {enrollment?.organization?.name}
          </Text>
        </View>
        <View style={styles.sessionContainer}>
          <Text style={styles.sessionText}>Branch:</Text>
          <Text style={[styles.sessionDate, {width: gGap(220)}]}>
            {enrollment?.branch?.name}
          </Text>
        </View>
        <View style={styles.sessionContainer}>
          <Text style={styles.instructorText}>Status:</Text>
          <Text
            style={[
              styles.approvedText,
              {
                color: enrollment?.status === 'approved' ? 'green' : 'red',
                textTransform: 'capitalize',
              },
            ]}>
            {enrollment?.status}
          </Text>
        </View>
        <View style={{marginTop: gGap(10)}}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              gap: gGap(10),
              marginBottom: gGap(5),
            }}>
            <Text style={styles.instructorText}>Payment status</Text>
            <View
              style={{
                backgroundColor: Colors.SuccessColor + '30',
                paddingHorizontal: gGap(10),
                borderWidth: 1,
                borderColor: Colors.SuccessColor,
                borderRadius: borderRadius.circle,
                paddingVertical: gGap(2),
              }}>
              <Text
                style={{
                  color: Colors.SuccessColor,
                  fontFamily: CustomFonts.REGULAR,
                }}>
                {enrollment.totalPaid === enrollment.totalAmount
                  ? 'Paid'
                  : enrollment.totalPaid === 0
                  ? 'Unpaid'
                  : 'Partially Paid'}
              </Text>
            </View>
          </View>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              gap: gGap(10),
              marginTop: gGap(5),
            }}>
            <PayContainer
              title={'Total Fee'}
              amount={enrollment.totalAmount}
              Colors={Colors}
              background={Colors.PureGray}
            />
            <PayContainer
              title={'Paid'}
              amount={enrollment?.totalPaid || 0}
              Colors={Colors}
              background={Colors.PureCyan}
            />
            <PayContainer
              title={'Due'}
              amount={enrollment.totalAmount - enrollment.totalPaid! || 0}
              Colors={Colors}
              background={Colors.PureYellow}
            />
          </View>
        </View>

        {(enrollment?.status === 'approved' ||
          enrollment?.status === 'trial') && (
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={enrollment?._id === active?._id}
            onPress={() => handleSwitch(enrollment)}
            style={[
              styles.switchBtn,
              {
                backgroundColor:
                  active?._id === enrollment?._id ? 'grey' : Colors.Primary,
              },
            ]}>
            <Text
              style={[
                styles.switchBtnText,
                {
                  color:
                    active?._id === enrollment?._id
                      ? Colors.SecondaryButtonTextColor
                      : Colors.PureWhite,
                },
              ]}>
              {enrollment?._id === active?._id
                ? `Current ${enrollment.program.type}`
                : `Go to ${enrollment?.program?.type}`}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const getStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors.Foreground,
      width: '100%',
      borderRadius: 5,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      alignSelf: 'center',
      padding: gGap(10),
    },
    title: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.9),
      color: Colors.Heading,
      width: responsiveScreenWidth(75),
    },
    sessionContainer: {
      flexDirection: 'row',
      marginTop: responsiveScreenHeight(1),
      alignItems: 'center',
    },
    sessionText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
    },
    instructorText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.Heading,
    },
    sessionDate: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
      marginLeft: 6,
    },
    approvedText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.Primary,
      marginLeft: responsiveScreenWidth(1),
    },
    switchBtn: {
      backgroundColor: Colors.Primary,
      height: responsiveScreenHeight(4),
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: responsiveScreenHeight(1),
      borderRadius: 7,
    },
    switchBtnText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.Foreground,
    },
  });

const PayContainer = ({
  Colors,
  background,
  amount = 0,
  title = '',
}: {
  background: string;
  Colors: TColors;
  amount: number;
  title: string;
}) => {
  return (
    <View
      style={{
        backgroundColor: background + '50' || 'gray',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: gGap(10),
        borderRadius: borderRadius.small,
      }}>
      <RNText style={{color: Colors.BodyText}}>{title}</RNText>
      <Text
        style={{
          color: background || Colors.BodyText,
          fontWeight: '700',
          fontSize: fontSizes.heading,
          marginTop: gGap(2),
        }}>
        ${Number.isInteger(amount) ? amount : amount ? amount.toFixed(1) : 0}
      </Text>
    </View>
  );
};
