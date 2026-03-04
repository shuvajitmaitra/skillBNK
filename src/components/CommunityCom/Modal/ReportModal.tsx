import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import ReactNativeModal from 'react-native-modal';

import CustomFonts from '../../../constants/CustomFonts';
import axiosInstance from '../../../utility/axiosInstance';
import {useTheme} from '../../../context/ThemeContext';
import ModalCustomButton from '../../ChatCom/Modal/ModalCustomButton';
import TextArea from '../../Calendar/Modal/TextArea';
import {handleError} from '../../../actions/chat-noti';
import {useDispatch} from 'react-redux';
import GlobalRadioGroup from '../../SharedComponent/GlobalRadioButton';
import {
  loadComPostNewly,
  showAlertModal,
} from '../../../utility/commonFunction';
import {showToast} from '../../HelperFunction';
import Toast from 'react-native-toast-message';
import {toastConfig} from '../../../constants/ToastConfig';
import CrossCircle from '../../../assets/Icons/CrossCircle';
import {RegularFonts} from '../../../constants/Fonts';
import {setSinglePost} from '../../../store/reducer/communityReducer';
import {TColors} from '../../../types';
import {IPost} from '../../../types/community/community';

type ReportModalProps = {
  setIsModalVisible: () => void;
  isModalVisible: boolean;
  post: IPost;
  closePopup: () => void;
};

export default function ReportModal({
  setIsModalVisible,
  isModalVisible,
  post,
  closePopup,
}: ReportModalProps) {
  const [report, setReport] = useState<{
    post: string;
    action: string;
    reportReason: string | number;
    note: string;
  }>({
    post: post?._id || '',
    action: 'report',
    reportReason: 'spam',
    note: '',
  });

  const Colors = useTheme();
  const styles = getStyles(Colors);

  const itemList = [
    {id: 1, label: 'Spam or Scam', value: 'spam'},
    {id: 2, label: 'Bullying or Harassment', value: 'harassment'},
    {id: 3, label: 'Impersonation', value: 'impersonation'},
    {id: 4, label: 'Privacy Violation', value: 'privacyViolation'},
    {id: 5, label: 'Hate Speech or Discrimination', value: 'hateSpeech'},
    {id: 6, label: 'Other', value: 'other'},
  ];

  // const [selectedId, setSelectedId] = useState(1);
  const dispatch = useDispatch();

  const handleReport = async () => {
    // showToast({message: 'Reported successfully'});
    // console.log("post._id", JSON.stringify(post._id, null, 1));
    // dispatch(setCommunityPosts(posts.filter(item => item._id !== post._id)));
    // dispatch(filterPosts(post?._id));
    // console.log('report', JSON.stringify(report, null, 2));
    try {
      await axiosInstance
        .post('/content/community/post/option/save', report)
        .then(res => {
          console.log('Handle Report called....');
          if (res.data.success) {
            loadComPostNewly();
            dispatch(setSinglePost(null));
            closePopup();
          }
          if (!res.data.postOption) {
            setIsModalVisible();
            dispatch(setSinglePost(null));
            return;
          }
          if (res.data?.postOption?._id) {
            showToast({message: 'Reported successfully'});
            setIsModalVisible();
            console.log('Report successful');
            dispatch(setSinglePost(null));
          } else {
            console.warn('Unexpected response structure:', res.data);
            showAlertModal('Report removed!');
            setIsModalVisible();
            dispatch(setSinglePost(null));
          }
        })
        .catch(error => {
          console.log(
            'error to report',
            JSON.stringify(error.response.data, null, 1),
          );
        });
    } catch (error) {
      handleError(error);
      console.error('An error occurred while reporting:', error);
    }
  };

  return (
    <ReactNativeModal
      backdropColor={Colors.BackDropColor}
      isVisible={isModalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalChild}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: Colors.BorderColor,
              paddingBottom: 10,
            }}>
            <Text
              style={{
                fontSize: RegularFonts.HS,
                fontFamily: CustomFonts.SEMI_BOLD,
                color: Colors.Heading,
              }}>
              Report post
            </Text>
            <TouchableOpacity onPress={() => setIsModalVisible()}>
              <CrossCircle size={35} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalHeading}>
            <Text style={styles.modalHeadingText}>
              Please tell us why you want to report this post! (optional)
            </Text>
            <Text style={styles.headingDescription}>
              Post Title: {post?.title}
            </Text>
          </View>

          {/* Replacing RadioGroup with globalRadio */}
          <GlobalRadioGroup
            options={itemList}
            selectedValue={report.reportReason}
            onSelect={(value: string | number) =>
              setReport(prev => ({...prev, reportReason: value}))
            }
          />

          <TextArea
            placeholderText={'Leave a note...'}
            setState={(text: string) => {
              setReport(pre => ({...pre, note: text}));
            }}
            state={report.note}
          />
          <View style={styles.buttonContainer}>
            <ModalCustomButton
              toggleModal={setIsModalVisible}
              textColor={Colors.SecondaryButtonTextColor}
              backgroundColor={Colors.SecondaryButtonBackgroundColor}
              buttonText="Cancel"
              customContainerStyle={{
                borderWidth: 1,
                borderColor: Colors.BorderColor,
              }}
            />
            <ModalCustomButton
              toggleModal={handleReport}
              textColor={Colors.PrimaryButtonTextColor}
              backgroundColor={Colors.PrimaryButtonBackgroundColor}
              buttonText="Submit!"
            />
          </View>
        </View>
        <Toast config={toastConfig} />
      </View>
    </ReactNativeModal>
  );
}

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    modalContainer: {
      height: responsiveScreenHeight(100),
      flex: 1,
      width: responsiveScreenWidth(90),
      justifyContent: 'center',
    },

    modalChild: {
      backgroundColor: Colors.Foreground,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4.5),
      paddingVertical: responsiveScreenWidth(4.5),
      maxHeight: responsiveScreenHeight(80),
    },
    modalHeading: {
      justifyContent: 'flex-start',
      paddingTop: responsiveScreenHeight(1.7),
      gap: responsiveScreenWidth(2),
    },
    modalArrowIcon: {
      fontSize: responsiveScreenFontSize(2.5),
      color: 'rgba(71, 71, 72, 1)',
    },
    modalHeadingText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Heading,
    },
    headingDescription: {
      color: Colors.BodyText,
      width: '100%',
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
    },
    radioButton: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    buttonGroup: {
      borderBottomWidth: 1,
      borderColor: Colors.BorderColor,
      paddingTop: responsiveScreenHeight(2),
      paddingBottom: responsiveScreenHeight(2.5),
    },
    radioText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.9),
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(2.5),
      justifyContent: 'center',
      paddingTop: responsiveScreenHeight(2.2),
    },
  });
