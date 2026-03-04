import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import CustomMultiSelectDropDown, {
  OptionItem,
} from '../SharedComponent/CustomMultiSelectDropdown';
import CustomDropDown from '../SharedComponent/CustomDropDown';
import {useTheme} from '../../context/ThemeContext';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {RootState} from '../../types/redux/root';
import {TColors} from '../../types';
import {setEventReminders} from '../../store/reducer/calendarReducerV2';
import {borderRadius, fontSizes, gGap} from '../../constants/Sizes';
import CrowdSelectModal from './CrowdSelectModal';
import CrossCircle from '../../assets/Icons/CrossCircle';

const EventNotificationContainerV2 = () => {
  const {eventReminders: notification} = useSelector(
    (state: RootState) => state.calendarV2,
  );
  const [crowdsVisible, setCrowdsVisible] = useState(false);

  const dispatch = useDispatch();

  const {groupNameId} = useSelector((state: RootState) => state.chat);

  const onChangeValue = (key: string, value: any) => {
    let updatedNotification = {...notification};

    // console.log('key', JSON.stringify(key, null, 2));
    // console.log('key', key);
    // console.log('value', value);

    // console.log('value', JSON.stringify(value, null, 2));

    if (key === 'offsetMinutes') {
      updatedNotification = {
        ...updatedNotification,
        offsetMinutes: parseInt(value, 5),
      };
    }

    if (key === 'crowds') {
      updatedNotification = {
        ...updatedNotification,
        crowds: [...value],
      };
    } else if (key === 'methods') {
      if (!value.includes('crowds')) {
        updatedNotification = {
          ...updatedNotification,
          crowds: [],
          methods: value,
        };
      } else {
        updatedNotification = {
          ...updatedNotification,
          methods: value,
        };
      }
    } else {
      updatedNotification = {
        ...updatedNotification,
        [key]: value,
      };
    }
    dispatch(
      setEventReminders({
        methods: updatedNotification.methods || ['email'],
        crowds: updatedNotification.crowds || [],
        offsetMinutes: updatedNotification.offsetMinutes || 5,
      }),
    );
  };

  const Colors = useTheme();
  const styles = getStyles(Colors);
  // Prepare the options for methods and crowds
  const methods =
    notification?.methods?.length! > 0
      ? notification?.methods?.map((i: string) => ({
          data: i,
          type:
            i === 'push'
              ? 'Notification'
              : i === 'directMessage'
              ? 'Chat DM'
              : i === 'crowds'
              ? 'Chat Crowds'
              : i === 'email'
              ? 'Email'
              : i === 'text'
              ? 'Text Message'
              : '',
        }))
      : [{data: 'email', type: 'Email'}];
  const group = groupNameId
    ?.filter((grp: {data: string; type: string}) =>
      notification?.crowds?.includes(grp?.data),
    )
    .map((a: {data: string; type: string}) => ({
      data: a.data,
      type: a.type,
    }));

  return (
    <View style={styles.notification}>
      <View style={styles.notificationRow}>
        <View style={styles.dropdownContainer}>
          <CustomDropDown
            options={[
              {data: '5', type: '5 minutes before'},
              {data: '10', type: '10 minutes before'},
              {data: '15', type: '15 minutes before'},
              {data: '20', type: '20 minutes before'},
              {data: '30', type: '30 minutes before'},
              {data: '45', type: '45 minutes before'},
              {data: '60', type: '1 hour before'},
              {data: '120', type: '2 hour before'},
            ]}
            type={
              notification?.offsetMinutes == 5
                ? '5 minutes before'
                : notification?.offsetMinutes == 10
                ? '10 minutes before'
                : notification?.offsetMinutes == 15
                ? '15 minutes before'
                : notification?.offsetMinutes == 20
                ? '20 minutes before'
                : notification?.offsetMinutes == 30
                ? '30 minutes before'
                : notification?.offsetMinutes == 40
                ? '45 minutes before'
                : notification?.offsetMinutes == 60
                ? '1 hour before'
                : notification?.offsetMinutes == 120
                ? '2 hour before'
                : '5 minutes before'
            }
            setState={time => {
              onChangeValue('offsetMinutes', time);
            }}
          />
          <CustomMultiSelectDropDown
            options={[
              {data: 'directMessage', type: 'Chat DM'},
              {data: 'crowds', type: 'Chat Crowds'},
              {data: 'push', type: 'Notification'},
              {data: 'text', type: 'Text Message'},
              {data: 'email', type: 'Email'},
            ]}
            initialSelections={methods}
            setState={mtd => {
              onChangeValue(
                'methods',
                mtd?.map((i: OptionItem) => i.data),
              );
            }}
          />
          {notification?.methods?.includes('crowds') && (
            <>
              {group.length > 0 && (
                <Text
                  style={{
                    fontSize: fontSizes.subHeading,
                    color: Colors.Heading,
                    fontWeight: '600',
                  }}>
                  Selected Crowd
                </Text>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 5,
                }}>
                {group.length > 0 &&
                  group.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(
                          setEventReminders({
                            methods: notification.methods || ['email'],
                            crowds:
                              notification.crowds.filter(
                                i => i !== item.data,
                              ) || [],
                            offsetMinutes: notification.offsetMinutes || 5,
                          }),
                        );
                      }}
                      style={styles.selectedItemsContainer}
                      key={index}>
                      <Text
                        style={{
                          paddingVertical: responsiveScreenHeight(0.5),
                          color: Colors.BodyText,
                          fontSize: fontSizes.body,
                        }}>
                        {item.type}
                      </Text>
                      <View style={styles.crossContainer}>
                        <CrossCircle size={22} color={Colors.Red} />
                      </View>
                    </TouchableOpacity>
                  ))}
              </View>
              <TouchableOpacity
                onPress={() => {
                  setCrowdsVisible(!crowdsVisible);
                }}
                style={{
                  backgroundColor: Colors.PrimaryButtonBackgroundColor,
                  paddingVertical: gGap(8),
                  justifyContent: 'center',
                  borderRadius: borderRadius.default,
                }}>
                <Text
                  style={{
                    color: Colors.PrimaryButtonTextColor,
                    fontSize: fontSizes.body,
                    fontFamily: CustomFonts.REGULAR,
                    fontWeight: '500',
                    textAlign: 'center',
                  }}>
                  Select Crowds
                </Text>
                <CrowdSelectModal
                  isVisible={crowdsVisible}
                  onCancelPress={() => {
                    setCrowdsVisible(!crowdsVisible);
                  }}
                  options={groupNameId}
                  initialSelections={group}
                  setState={crowds => {
                    console.log('crowds', JSON.stringify(crowds, null, 2));
                    onChangeValue(
                      'crowds',
                      crowds.map((x: OptionItem) => x.data),
                    );
                  }}
                  data={{
                    message: 'Max 3 crowds allowed',
                    placeholder: 'Select crowds',
                  }}
                />
              </TouchableOpacity>

              {/* <CustomMultiSelectDropDown
                options={groupNameId}
                initialSelections={group}
                setState={crowds => {
                  console.log('crowds', JSON.stringify(crowds, null, 2));
                  onChangeValue(
                    'crowds',
                    crowds.map((x: OptionItem) => x.data),
                  );
                }}
                data={{
                  message: 'Max 3 crowds allowed',
                  placeholder: 'Select crowds',
                }}
              /> */}
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default EventNotificationContainerV2;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    selectedItemsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: responsiveScreenWidth(1),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: 4,
    },
    crossContainer: {
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dropdownContainer: {
      flex: 1,
      gap: responsiveScreenHeight(1),
    },
    notification: {
      backgroundColor: Colors.ModalBoxColor,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor3,
      borderRadius: responsiveScreenWidth(3),
      padding: responsiveScreenWidth(3),
      marginTop: responsiveScreenHeight(1),
      flexDirection: 'column',
      gap: 10,
      marginBottom: responsiveScreenHeight(2),
      zIndex: 3,
    },
    notificationRow: {
      flexDirection: 'row',
      gap: 10,
    },
    addNotificationContainer: {
      backgroundColor: Colors.Primary,
      borderRadius: 5,
      width: responsiveScreenWidth(33),
      alignItems: 'center',
      paddingVertical: responsiveScreenHeight(0.5),
    },
    addNotificationText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.PureWhite,
    },
  });
