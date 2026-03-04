import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import Modal from 'react-native-modal';
import {useTheme} from '../../context/ThemeContext';
import ModalBackAndCrossButton from '../ChatCom/Modal/ModalBackAndCrossButton';
import CustomDropDown from '../SharedComponent/CustomDropDown';
import ModalCustomButton from '../ChatCom/Modal/ModalCustomButton';
import CustomFonts from '../../constants/CustomFonts';
import moment from 'moment';
import CalenderIcon from '../../assets/Icons/CalenderIcon';
import RequireFieldStar from '../../constants/RequireFieldStar';
import {TAddPaymentModalProps} from '../../types/courses/payment.types';
import {TColors} from '../../types';
import {theme} from '../../utility/commonFunction';

const AddPaymentModal = ({
  handleAddPayment,
  isAddPaymentModalVisible,
  toggleAddPaymentModal,
  date,
  attachment,
  setMethod,
  setAmount,
  setNote,
}: TAddPaymentModalProps) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  // const [date, setDate] = useState(new Date());
  // const [isLoading, setIsLoading] = useState(false);
  // const [isCalendarClicked, setIsCalendarClicked] = useState(false);
  // const onChangeDate = selectedDate => {
  //   // setIsCalendarClicked(false);
  //   setDate(
  //     new Date(
  //       selectedDate.nativeEvent.timestamp +
  //         selectedDate.nativeEvent.utcOffset * 60000,
  //     ).toISOString(),
  //   );
  //   // console.log(date);
  //   //"2024-05-16T17:00:05.000Z"
  // };

  const showCalendar = () => {
    // setIsCalendarClicked(true);
  };

  // const options = [{type: 'Public'}, {type: 'Private'}];
  const modeOption = [
    {type: 'Cash', data: 'Cash'},
    {type: 'Check', data: 'Check'},
    {type: 'Card (Square Payment)', data: 'Card (Square Payment)'},
    {type: 'Venmo @SchoolshubPayment ', data: 'Venmo @SchoolshubPayment '},
    {type: 'CashApp $SchoolshubPayment ', data: 'CashApp $SchoolshubPayment '},
    {type: 'Zelle: (586)-665-3331', data: 'Zelle: (586)-665-3331'},
  ];

  const uploadImage = async () => {
    // try {
    //   const result = await DocumentPicker.getDocumentAsync({
    //     type: "image/*",
    //     copyToCacheDirectory: true,
    //   });
    //   if (result.type === "cancel") {
    //     console.log("User canceled the document picker");
    //     return;
    //   }
    //   setIsLoading(true);
    //   const { uri, name, size } = result.assets[0];
    //   // Create form data
    //   const formData = new FormData();
    //   formData.append("file", {
    //     uri,
    //     name,
    //     type: "image/jpeg",
    //   });
    //   const url = "/document/userdocumentfile";
    //   const response = await axiosInstance.post(url, formData, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   });
    //   if (response?.data?.success) {
    //     // console.log("File uploaded successfully:", response.data);
    //     setAttachment(response?.data?.fileUrl);
    //     setIsLoading(false);
    //   }
    //   setIsLoading(false);
    // } catch (error) {
    //   setIsLoading(false);
    //   if (error?.response) {
    //     console?.error("Server error:", error?.response?.data);
    //   } else if (error?.request) {
    //     console?.error("Network error:", error?.request);
    //     console?.log("Network error:", JSON?.stringify(error?.request, null, 1));
    //   } else {
    //     // Something else caused the error
    //     console?.error("Error:", error?.message);
    //   }
    // }
  };
  return (
    <Modal isVisible={isAddPaymentModalVisible}>
      {/* {isCalendarClicked && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date()}
          mode={'date'}
          is24Hour={true}
          display="default"
          onChange={onChangeDate}
        />
      )} */}
      <View style={styles.container}>
        {/* -------------------------- */}
        {/* ----------- Back Arrow button ----------- */}
        {/* -------------------------- */}
        <ModalBackAndCrossButton toggleModal={toggleAddPaymentModal} />
        {/* -------------------------- */}
        {/* ----------- Main View Start form here ----------- */}
        {/* -------------------------- */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.subContainer}>
            {/* -------------------------- */}
            {/* ----------- Header container ----------- */}
            {/* -------------------------- */}
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Add Payment</Text>
              <Text style={styles.headerDescription}>
                Kindly complete the form to include a payment.
              </Text>
            </View>
            {/* -------------------------- */}
            {/* ----------- Crowd Name Container ----------- */}
            {/* -------------------------- */}
            <View style={styles.fieldContainer}>
              <Text style={styles.Text}>
                Method
                <RequireFieldStar />
              </Text>
              <CustomDropDown
                options={modeOption}
                type={'Select Payment Method'}
                setState={setMethod}
              />
              {/* <TextInput
                placeholderTextColor={Colors.BodyText}
                style={styles.inputField}
                placeholder={"Crowd name"}
                // onChangeText={setChatName}
              /> */}
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.Text}>
                Amount
                <RequireFieldStar />
              </Text>

              <TextInput
                keyboardAppearance={theme()}
                keyboardType="numeric"
                placeholderTextColor={Colors.BodyText}
                style={styles.inputField}
                placeholder={'Amount'}
                onChangeText={text => setAmount(parseFloat(text) || 0)}
              />
            </View>
            <View style={[styles.fieldContainer, {position: 'relative'}]}>
              <Text style={styles.Text}>
                Payment Date
                <RequireFieldStar />
              </Text>
              <View
                style={[
                  styles.inputField,
                  {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    // backgroundColor: "red",

                    // flex: 1,
                  },
                ]}>
                <Text
                  style={{
                    paddingVertical: responsiveScreenHeight(0.5),
                    fontFamily: CustomFonts.REGULAR,
                    color: Colors.Heading,
                  }}>
                  {date ? moment(date).format('MMM DD, YYYY') : 'Payment Date'}
                </Text>
                <TouchableOpacity onPress={() => showCalendar()}>
                  <CalenderIcon size={18} color={Colors.BodyText} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.idStyle}>Upload Attachment (Optional)</Text>
              <TouchableOpacity onPress={uploadImage} style={styles.attachment}>
                <Text style={styles.uploadText}>Upload Attachment</Text>
              </TouchableOpacity>
              <Text style={styles.attachmentText}>
                Upload JPEG/PNG/PDF/Docs file
              </Text>
            </View>

            {attachment && (
              <View style={styles.docPreview}>
                <Image
                  style={{height: 100, width: '50%'}}
                  source={{uri: attachment}}
                />
              </View>
            )}

            <View style={styles.fieldContainer}>
              <Text style={styles.Text}>Add Note</Text>
              <View style={[styles.inputContainer, {height: 'auto'}]}>
                <TextInput
                  keyboardAppearance={theme()}
                  style={[styles.textAreaInput]}
                  multiline={true}
                  onChangeText={setNote}
                  placeholderTextColor={Colors.BodyText}
                  placeholder={'Enter Note'}
                />
              </View>
            </View>

            {/* -------------------------- */}
            {/* ----------- Border and button  ----------- */}
            {/* -------------------------- */}
            <View
              style={{
                borderBottomWidth: 1,
                marginBottom: responsiveScreenHeight(2),
                borderBottomColor: Colors.BorderColor,
              }}
            />
            <View style={styles.buttonContainer}>
              <ModalCustomButton
                toggleModal={toggleAddPaymentModal}
                textColor={Colors.Primary}
                backgroundColor={Colors.PrimaryOpacityColor}
                buttonText="Cancel"
              />

              <ModalCustomButton
                toggleModal={() => {
                  handleAddPayment();
                }}
                textColor={Colors.PureWhite}
                backgroundColor={Colors.Primary}
                buttonText="Save"
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default AddPaymentModal;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    docPreview: {
      marginBottom: 10,
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
      // paddingVertical: responsiveScreenHeight(2.5),
    },
    // bottomBorder: {
    //   borderBottomWidth: 0.5,
    //   borderBottomColor: "rgba(0, 0, 0, 0.3)",
    // },
    // --------------------------
    // ----------- Crowd Name Container -----------
    // --------------------------
    fieldContainer: {
      marginBottom: responsiveScreenHeight(2),
      // backgroundColor: "red",
    },
    inputFieldContainer: {
      // marginBottom: responsiveScreenHeight(1),
    },
    Text: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      marginBottom: responsiveScreenHeight(1),
      color: Colors.Heading,
    },
    inputContainer: {
      borderRadius: 10,
      borderWidth: 1,
      flexDirection: 'row',
      backgroundColor: Colors.ModalBoxColor,
      alignItems: 'center',
      borderColor: Colors.BorderColor,
    },
    textAreaInput: {
      width: '100%',
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
      // backgroundColor: "red",
      fontFamily: CustomFonts.REGULAR,
      paddingVertical: responsiveScreenHeight(1),
      textAlignVertical: 'top',
      marginLeft: responsiveScreenWidth(2),
      minHeight: responsiveScreenHeight(10),
    },
    inputField: {
      backgroundColor: Colors.ModalBoxColor,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.Heading,
    },
    // --------------------------
    // ----------- Header Container -----------
    // --------------------------
    headerContainer: {
      gap: responsiveScreenWidth(2),
      marginBottom: responsiveScreenHeight(2),
      marginTop: responsiveScreenHeight(1),
    },
    headerText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.Heading,
    },
    headerDescription: {
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
    },
    // --------------------------
    // ----------- Main Container -----------
    // --------------------------
    container: {
      paddingTop: responsiveScreenHeight(2),
      paddingHorizontal: responsiveScreenWidth(4.5),
      paddingVertical: responsiveScreenWidth(4.5),
      backgroundColor: Colors.Foreground,
      borderRadius: responsiveScreenWidth(2),
      height: responsiveScreenHeight(80),
    },
    topBarContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      minWidth: '100%',
    },
    subContainer: {
      // maxHeight: responsiveScreenHeight(70),
      minWidth: responsiveScreenWidth(80),
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
