import {ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from '../../context/ThemeContext';
import ModalCustomButton from '../ChatCom/Modal/ModalCustomButton';
import CustomFonts from '../../constants/CustomFonts';
import axiosInstance from '../../utility/axiosInstance';
import {initialActivities} from '../../store/reducer/activitiesReducer';
import {showToast} from '../HelperFunction';
import FileUploader from '../SharedComponent/FileUploder';
import GlobalAlertModal from '../SharedComponent/GlobalAlertModal';
import {
  compareObject,
  showAlertModal,
  theme,
} from '../../utility/commonFunction';
import RequireFieldStar from '../../constants/RequireFieldStar';
import ModalCrossButton from '../ChatCom/Modal/ModalCrossButton';
import SaveConfirmationModal from '../SharedComponent/SaveConfirmationModal';
import {TActivities, TColors} from '../../types';
import {RootState} from '../../types/redux/root';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface CreateActivitiesModalProps {
  isCreateActivitiesModalVisible: boolean;
  toggleCreateActivitiesModal: () => void;
  action?: string;
  activityId?: string;
  setIsCreateActivitiesModalVisible: (
    isVisible: boolean | ((prev: boolean) => boolean),
  ) => void;
}

const CreateActivitiesModal: React.FC<CreateActivitiesModalProps> = ({
  isCreateActivitiesModalVisible,
  toggleCreateActivitiesModal,
  action,
  activityId,
  setIsCreateActivitiesModalVisible,
}) => {
  const {activities} = useSelector((state: RootState) => state.activities);
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);

  // Define the state types using Partial<TActivities> since initially they may be empty.
  const [activity, setActivity] = useState<Partial<TActivities>>({});
  const [initialState, setInitialState] = useState<Partial<TActivities>>({});
  const [saveConfirmVisible, setSaveConfirmVisible] = useState<boolean>(false);
  const {top} = useSafeAreaInsets();

  // Find the activity data if activities exist.
  const activityData: Partial<TActivities> = useMemo(
    () =>
      activities.length > 0
        ? activities.find((item: TActivities) => item._id === activityId) || {}
        : {},
    [activities, activityId],
  );

  useEffect(() => {
    setActivity(activityData);
    setInitialState(activityData);
  }, [activityData]);

  const data = {
    ...activity,
    category: 'day2day',
  };

  const handleCreateActivities = () => {
    if (!activity?.title?.trim()) {
      return showAlertModal({
        title: 'Empty Title',
        type: 'warning',
        message: 'Title field is required',
      });
    }
    if (!activity?.description?.trim()) {
      return showAlertModal({
        title: 'Empty Description',
        type: 'warning',
        message: 'Description field is required',
      });
    }
    axiosInstance
      .post('/communication/shout', data)
      .then(res => {
        if (res.data.success) {
          showToast({message: 'Activities created successfully...'});
          dispatch(
            initialActivities({
              data: [res.data.post, ...activities],
              page: 1,
            }),
          );
          setActivity({});
          toggleCreateActivitiesModal();
        }
      })
      .catch(error => {
        if (error.response) {
          console.log(
            'Server error:',
            JSON.stringify(error.response.data, null, 1),
          );
        } else if (error.request) {
          console.log('Network error:', JSON.stringify(error.request, null, 1));
        } else {
          console.log('Error:', JSON.stringify(error.message, null, 1));
        }
      });
  };

  const handleUpdateActivities = (id: string) => {
    if (!activity?.title) {
      return showToast({message: 'Title field required'});
    }
    if (!activity?.description) {
      return showToast({message: 'Description field required'});
    }
    axiosInstance
      .patch(`communication/update/${id}`, data)
      .then(res => {
        if (res.data.success) {
          dispatch(
            initialActivities({
              data: activities.map((item: TActivities) =>
                item._id === id ? res.data.post : item,
              ),
              page: 1,
            }),
          );
          showToast({message: 'Activities updated'});
          toggleCreateActivitiesModal();
        }
      })
      .catch(error => {
        console.log(
          'Error in update communication (create activities modal):',
          JSON.stringify(error, null, 1),
        );
      });
  };

  return (
    <Modal
      avoidKeyboard={true}
      isVisible={isCreateActivitiesModalVisible}
      style={{
        margin: 0,
      }}>
      {/* -------------------------- */}
      {/* ----------- Top Bar ----------- */}
      {/* -------------------------- */}

      <View
        style={[
          styles.container,
          {paddingTop: top, backgroundColor: Colors.Background_color},
        ]}>
        <View style={styles.topBarContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>
              {action ? action : 'create'} Activities
            </Text>
            <Text style={styles.headerDescription}>
              Please fill out the form to {action ? action : 'create'} an
              activity.
            </Text>
          </View>
          <ModalCrossButton
            onPress={() => {
              compareObject(initialState, activity)
                ? toggleCreateActivitiesModal()
                : setSaveConfirmVisible(true);
            }}
          />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* -------------------------- */}
          {/* ----------- Main Form ----------- */}
          {/* -------------------------- */}
          <View style={styles.subContainer}>
            <View style={styles.fieldContainer}>
              <Text style={styles.Text}>
                Title
                <RequireFieldStar />
              </Text>
              <TextInput
                keyboardAppearance={theme()}
                placeholderTextColor={Colors.BodyText}
                style={styles.inputField}
                placeholder="Enter title"
                value={activity.title || ''}
                onChangeText={text =>
                  setActivity(prev => ({...prev, title: text}))
                }
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.Text}>
                Description
                <RequireFieldStar />
              </Text>
              <View style={[styles.inputContainer, {height: 'auto'}]}>
                <TextInput
                  keyboardAppearance={theme()}
                  spellCheck={true}
                  style={styles.textAreaInput}
                  multiline={true}
                  value={activity.description || ''}
                  onChangeText={text =>
                    setActivity(prev => ({...prev, description: text}))
                  }
                  placeholderTextColor={Colors.BodyText}
                  placeholder="Enter description"
                />
              </View>
            </View>
          </View>
          <FileUploader
            setAttachments={(value: React.SetStateAction<string[]>) => {
              setActivity((prev: Partial<TActivities>) => ({
                ...prev,
                attachments:
                  typeof value === 'function'
                    ? value(prev.attachments || [])
                    : value,
              }));
            }}
            attachments={activity.attachments || []}
          />
        </ScrollView>

        <View style={styles.buttonContainer}>
          <ModalCustomButton
            toggleModal={() => {
              compareObject(initialState, activity)
                ? toggleCreateActivitiesModal()
                : setSaveConfirmVisible(true);
            }}
            textColor={Colors.Primary}
            backgroundColor={Colors.PrimaryOpacityColor}
            buttonText="Cancel"
          />
          <ModalCustomButton
            toggleModal={() => {
              if (action && activityId) {
                handleUpdateActivities(activityId);
              } else {
                handleCreateActivities();
              }
            }}
            textColor={Colors.PureWhite}
            backgroundColor={Colors.Primary}
            buttonText={activityId ? 'Update' : 'Submit'}
          />
        </View>
      </View>
      <GlobalAlertModal />
      <SaveConfirmationModal
        isVisible={saveConfirmVisible}
        tittle="Save Changes"
        description="Are you sure you want to save changes?"
        onExitPress={() => {
          console.log('Ok Press');
          setSaveConfirmVisible(prev => !prev);
          setIsCreateActivitiesModalVisible((prev: boolean) => !prev);
        }}
        onContinuePress={() => {
          setSaveConfirmVisible(prev => !prev);
        }}
      />
    </Modal>
  );
};

export default CreateActivitiesModal;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    docPreview: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      flexBasis: 99,
      gap: 10,
    },
    CrossCircle: {
      backgroundColor: Colors.Primary,
      width: 20,
      justifyContent: 'center',
      alignItems: 'center',
      height: 20,
      borderRadius: 100,
      position: 'absolute',
      top: -10,
      right: -10,
    },
    idStyle: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
    },
    attachment: {
      height: responsiveScreenHeight(10),
      backgroundColor: Colors.PrimaryOpacityColor,
      borderRadius: responsiveScreenWidth(3),
      marginVertical: responsiveScreenHeight(1),
      borderStyle: 'dashed',
      borderColor: Colors.Primary,
      borderWidth: 1.5,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    uploadText: {
      color: Colors.Primary,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
    },
    attachmentText: {
      color: Colors.Heading,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(2.5),
      justifyContent: 'center',
    },
    fieldContainer: {
      marginBottom: responsiveScreenHeight(2),
    },
    inputFieldContainer: {},
    Text: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      marginBottom: responsiveScreenHeight(1),
      color: Colors.Heading,
    },
    inputContainer: {
      borderRadius: 10,
      borderWidth: 1,
      overflow: 'hidden',
      flexDirection: 'row',
      backgroundColor: Colors.ModalBoxColor,
      alignItems: 'center',
      borderColor: Colors.BorderColor,
      paddingRight: responsiveScreenWidth(3),
    },
    textAreaInput: {
      width: '100%',
      fontSize: responsiveScreenFontSize(1.7),
      color: Colors.Heading,
      fontFamily: CustomFonts.REGULAR,
      paddingVertical: responsiveScreenHeight(1),
      textAlignVertical: 'top',
      marginLeft: responsiveScreenWidth(2),
      minHeight: responsiveScreenHeight(10),
    },
    inputField: {
      backgroundColor: Colors.ModalBoxColor,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(2),
      height: responsiveScreenHeight(5),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.Heading,
    },
    headerContainer: {
      gap: responsiveScreenWidth(2),
      marginBottom: responsiveScreenHeight(2),
    },
    headerText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.Heading,
      textTransform: 'capitalize',
    },
    headerDescription: {
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
    },
    container: {
      flex: 1,
      padding: 20,
    },
    topBarContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    subContainer: {
      // minWidth: responsiveScreenWidth(80),
    },
    modalArrowIcon: {
      paddingBottom: responsiveScreenHeight(0.8),
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
      color: Colors.BodyText,
    },
    backButtonText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
    },
    cancelButton: {
      backgroundColor: Colors.PrimaryOpacityColor,
      padding: responsiveScreenWidth(2.5),
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
