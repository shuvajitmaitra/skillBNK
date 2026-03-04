import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import {useTheme} from '../context/ThemeContext';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../constants/CustomFonts';
import axiosInstance from '../utility/axiosInstance';
import ImageView from 'react-native-image-viewing';
import AddPaymentModal from '../components/PaymentCom/AddPaymentModal';
import {showToast} from '../components/HelperFunction';
import Loading from '../components/SharedComponent/Loading';
import Images from '../constants/Images';
import {useGlobalAlert} from '../components/SharedComponent/GlobalAlertContext';
import {TColors} from '../types';
import {TTransaction} from '../types/courses/payment.types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ImageURISource} from 'react-native';
import {HomeStackParamList} from '../types/navigation';
import Divider2 from '../components/SharedComponent/Divider2';
import RNText from '../components/SharedComponent/RNText';

// Define the component props using your HomeStackParamList.
type MyPaymentScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  'MyPaymentScreen'
>;

const MyPaymentScreen: React.FC<MyPaymentScreenProps> = ({route}) => {
  // State for the image viewer
  const [viewImage, setViewImage] = useState<ImageURISource[]>([]);
  const Colors = useTheme();
  const styles = getStyles(Colors);

  // State for transactions, amount, loading, modal, and payment form fields
  const [transactions, setTransactions] = useState<TTransaction[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalPaid, setTotalPaid] = useState<number>(0);
  const [isLoding, setIsLoading] = useState<boolean>(false);
  const [isAddPaymentModalVisible, setIsAddPaymentModalVisible] =
    useState<boolean>(false);
  const [method, setMethod] = useState<string>('');
  const [amount, setAmount] = useState<number>(10);
  const [date, setDate] = useState<Date | null>(null);
  const [attachment, setAttachment] = useState<any>(null);
  const [note, setNote] = useState<string>('');
  const {showAlert} = useGlobalAlert();

  const orderId = route.params?.courseId;

  useEffect(() => {
    if (orderId) {
      setIsLoading(true);
      axiosInstance
        .get(`/order/details/${orderId}`)
        .then(res => {
          setTransactions(res.data.transactions);
          setTotalAmount(res.data.order.amount);
          setTotalPaid(
            res.data.transactions.reduce(
              (total: number, item: TTransaction) => total + item.amount,
              0,
            ),
          );
          setIsLoading(false);
        })
        .catch(err => {
          console.log('err', JSON.stringify(err, null, 1));
          setIsLoading(false);
        });
    } else {
      setIsLoading(true);
      axiosInstance
        .get('/transaction/myTransaction')
        .then(res => {
          setTransactions(res.data.transactions);
          setTotalAmount(res.data.totalAmount);
          setTotalPaid(
            res.data.transactions.reduce(
              (total: number, item: TTransaction) =>
                item.status === 'accepted' ? total + item.amount : total,
              0,
            ),
          );
          setIsLoading(false);
        })
        .catch(err => {
          console.log('You got error', JSON.stringify(err, null, 1));
          setIsLoading(false);
        });
    }
  }, [orderId]);

  const handleAddPayment = () => {
    if (amount < 10) {
      return showAlert({
        title: 'Error',
        type: 'warning',
        message: 'Amount must be greater then 10$',
      });
    }
    const data = {
      method,
      amount,
      date,
      note,
      attachment,
    };

    axiosInstance
      .post(
        orderId ? `/order/addpayment/${orderId}` : '/transaction/addbyuser',
        data,
      )
      .then(res => {
        if (res.data.success) {
          setTransactions(prev => [res.data.transaction, ...prev]);
          handleCancel();
          toggleAddPaymentModal();
          showToast({message: 'Payment Added!'});
        } else {
          setTransactions(prev => [res.data.transaction, ...prev]);
          handleCancel();
        }
      })
      .catch((error: any) => {
        toggleAddPaymentModal();
        if (error.response) {
          console.log(
            'Server error:',
            JSON.stringify(error.response.data, null, 1),
          );
        } else if (error.request) {
          console.log('Network error:', JSON.stringify(error.request, null, 1));
        } else {
          console.error('Error:', JSON.stringify(error.message, null, 1));
        }
        error &&
          error.response &&
          showAlert({
            title: 'Error',
            type: 'error',
            message: error?.response?.data?.error,
          });
      });
  };

  const handleCancel = () => {
    setAmount(10);
    setMethod('');
    setDate(null);
    setNote('');
    setAttachment(null);
  };

  if (isLoding) {
    return (
      <View style={{flex: 1, backgroundColor: Colors.Background_color}}>
        <Loading backgroundColor="transparent" />
      </View>
    );
  }

  const toggleAddPaymentModal = () => {
    setIsAddPaymentModalVisible(prev => !prev);
  };

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.headerText}>Payment History</Text>
        <Divider2
          marginTop={responsiveScreenFontSize(0.7)}
          marginBottom={responsiveScreenFontSize(0.7)}
        />
        <View style={styles.amountWrapper}>
          <View style={[styles.amountContainer, {backgroundColor: '#4b56c0'}]}>
            <Text style={styles.amountText}>Total Amount</Text>
            <Text style={styles.amount}>${totalAmount.toFixed(2)}</Text>
          </View>
          <View style={[styles.amountContainer, {backgroundColor: '#00c177'}]}>
            <Text style={styles.amountText}>Paid Amount</Text>
            <Text style={styles.amount}>${totalPaid.toFixed(2) || 0}</Text>
          </View>
          <View style={[styles.amountContainer, {backgroundColor: '#ef7817'}]}>
            <RNText style={styles.amountText}>Due Amount</RNText>
            <Text style={styles.amount}>
              ${(totalAmount - totalPaid).toFixed(2)}
            </Text>
          </View>
        </View>
        {transactions?.length > 0 && (
          <ScrollView horizontal style={styles.tableContainer}>
            <ScrollView>
              <View style={styles.header}>
                <View style={[styles.box, {alignItems: 'flex-start'}]}>
                  <Text style={styles.headingText}>Amount</Text>
                </View>
                <View style={[styles.box, {alignItems: 'flex-start'}]}>
                  <Text style={styles.headingText}>Method</Text>
                </View>
                <View style={[styles.box, {alignItems: 'flex-start'}]}>
                  <Text style={styles.headingText}>Date</Text>
                </View>
                <View style={[styles.box, {alignItems: 'flex-start'}]}>
                  <Text style={styles.headingText}>Status</Text>
                </View>
                <View style={[styles.box, {alignItems: 'flex-start'}]}>
                  <Text style={styles.headingText}>Attachment</Text>
                </View>
                <View style={[styles.box, {alignItems: 'flex-start'}]}>
                  <Text style={styles.headingText}>Note</Text>
                </View>
              </View>
              <View style={styles.footer}>
                {transactions?.map((trx, i) => (
                  <View key={i} style={styles.row}>
                    <View
                      style={[
                        styles.box,
                        {
                          alignItems: 'flex-start',
                          marginLeft: responsiveScreenWidth(4),
                        },
                      ]}>
                      <Text style={styles.cell}>$ {trx.amount}</Text>
                    </View>
                    <View
                      style={[
                        styles.box,
                        {
                          alignItems: 'flex-start',
                          marginLeft: responsiveScreenWidth(4),
                        },
                      ]}>
                      <Text style={styles.cell}>{trx.method}</Text>
                    </View>
                    <View
                      style={[
                        styles.box,
                        {
                          alignItems: 'flex-start',
                          marginLeft: responsiveScreenWidth(4),
                        },
                      ]}>
                      <Text style={styles.cell}>
                        {moment(trx.date).format('MMM DD YYYY')}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.box,
                        {
                          alignItems: 'center',
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                        },
                      ]}>
                      <View
                        style={
                          {
                            height: 10,
                            borderRadius: 100,
                            backgroundColor:
                              (trx.status === 'accepted' && Colors.Primary) ||
                              (trx.status === 'pending' && Colors.StarColor) ||
                              (trx.status === 'pending' && Colors.Red),
                          } as any
                        }
                      />
                      <Text
                        style={[styles.cell, {textTransform: 'capitalize'}]}>
                        {trx.status || 'N/A'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        setViewImage([
                          trx.attachment
                            ? {uri: trx.attachment}
                            : Images.DEFAULT_IMAGE,
                        ])
                      }
                      style={[
                        styles.box,
                        {
                          alignItems: 'flex-start',
                          marginLeft: responsiveScreenWidth(4),
                        },
                      ]}>
                      <Image
                        style={styles.img}
                        source={
                          trx.attachment
                            ? {uri: trx.attachment}
                            : Images.DEFAULT_IMAGE
                        }
                      />
                    </TouchableOpacity>
                    <View
                      style={[
                        styles.box,
                        {
                          alignItems: 'flex-start',
                          marginLeft: responsiveScreenWidth(4),
                        },
                      ]}>
                      <Text style={styles.cell}>{trx?.note || 'N/A'}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </ScrollView>
        )}
      </View>
      <ImageView
        images={viewImage}
        imageIndex={0}
        visible={viewImage?.length !== 0}
        onRequestClose={() => setViewImage([])}
      />
      <AddPaymentModal
        handleAddPayment={handleAddPayment}
        method={method}
        amount={amount}
        date={date}
        note={note}
        attachment={attachment}
        setMethod={setMethod}
        setAmount={text => setAmount(text)}
        setDate={setDate}
        setAttachment={setAttachment}
        setNote={setNote}
        toggleAddPaymentModal={toggleAddPaymentModal}
        isAddPaymentModalVisible={isAddPaymentModalVisible}
      />
    </View>
  );
};

export default MyPaymentScreen;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    amountText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
      color: Colors.PureWhite,
    },
    amount: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2.4),
      color: Colors.PureWhite,
    },
    amountContainer: {
      flex: 1,
      padding: 10,
      paddingRight: 0,
      borderRadius: 10,
    },
    headerText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.4),
      color: Colors.Heading,
      // marginTop: responsiveScreenHeight(1),
      // marginLeft:
    },
    box: {
      width: responsiveScreenWidth(22),
      // backgroundColor: "green",
      height: responsiveScreenHeight(4),
      justifyContent: 'center',
      overflow: 'hidden',
      alignItems: 'flex-start',
      marginLeft: responsiveScreenWidth(4),
    },
    img: {
      width: responsiveScreenWidth(22),
      height: responsiveScreenHeight(4),
      overflow: 'hidden',
    },
    tableContainer: {
      borderTopStartRadius: 10,
      flex: 1,
      // padding: 10,
      // backgroundColor: Colors.Foreground,
    },
    header: {
      flexDirection: 'row',
      gap: 10,
      borderTopStartRadius: 10,
      borderTopEndRadius: 10,
      backgroundColor: Colors.Foreground,
      justifyContent: 'space-between',
    },
    footer: {
      borderTopStartRadius: 10,
      borderTopEndRadius: 10,
      // backgroundColor: "green",
    },
    row: {
      flexDirection: 'row',
      backgroundColor: Colors.Background_color,
      paddingVertical: 8,
      // paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: Colors.BorderColor,

      justifyContent: 'space-between',
      // alignItems: "center",
    },
    cell: {
      // flex: 1,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
      // backgroundColor: 'red',
      color: Colors.BodyText,
      maxWidth: responsiveScreenFontSize(12),
      textAlign: 'center',
    },
    headingText: {
      maxWidth: 100,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.Heading,
    },
    // buttonText: {
    //   color: Colors.PureWhite,
    //   fontWeight: "bold",
    //   textAlign: "center",
    // },
    // button: {
    //   backgroundColor: Colors.Primary,
    //   padding: 6,
    //   borderRadius: 5,
    //   justifyContent: "center",
    // },
    tableText: {
      color: Colors.BodyText,
    },
    tableHeading: {
      color: Colors.Heading,
    },
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
      padding: responsiveScreenFontSize(1.5),
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
      backgroundColor: Colors.Primary,
      zIndex: 10,
    },
    amountWrapper: {
      flexDirection: 'row',
      gap: responsiveScreenFontSize(1),
      justifyContent: 'space-between',
      marginBottom: responsiveScreenHeight(2),
    },
    card: {
      backgroundColor: Colors.Red,
      borderRadius: 5,
      paddingVertical: 5,
    },
    picker: {
      borderColor: Colors.Primary,
      borderWidth: 1,
      overflow: 'hidden',
      width: '100%',
      borderRadius: 15,
      padding: 0,
      backgroundColor: '#FFF',
    },
    border: {
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'stretch',
      borderWidth: 1,
      overflow: 'hidden',
      borderRadius: 5,
      borderColor: Colors.BorderColor,
    },
    date: {
      borderWidth: 1,
      overflow: 'hidden',
      borderRadius: 5,
      borderColor: Colors.BorderColor,
      padding: 15,
      marginTop: 10,
    },
    textInput: {
      color: Colors.Heading,
      borderColor: Colors.BorderColor,
      width: '100%',
      borderWidth: 1,
      overflow: 'hidden',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
      fontWeight: 'bold',
    },
    label: {
      fontWeight: 'bold',
      marginTop: 10,
    },
  });
