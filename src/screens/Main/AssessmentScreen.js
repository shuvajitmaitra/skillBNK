import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';

import CustomFonts from '../../constants/CustomFonts';
import MyButton from '../../components/AuthenticationCom/MyButton';
import axiosInstance from '../../utility/axiosInstance';
import {useTheme} from '../../context/ThemeContext';
import AssessmentRulesModal from '../../components/AssessmentCom/AssessmentRulesModal';
import StartTestModal from '../../components/AssessmentCom/StartTestModal';
import CongratulationModal from '../../components/AssessmentCom/CongratulationModal';
import Loading from '../../components/SharedComponent/Loading';
import NoDataAvailable from '../../components/SharedComponent/NoDataAvailable';
import moment from 'moment';
import ResultModal from '../../components/AssessmentCom/ResultModal';
// import { calculateNewMassToMatchDuration } from "react-native-reanimated/lib/typescript/reanimated2/animation/springUtils";
export default function AssessmentScreen() {
  const [isLoading, setIsLoading] = useState(false);

  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [isAssessmentRuleModalVisible, setIsAssessmentRuleModalVisible] =
    useState(false);
  const [items, setItems] = useState([]);
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);

  const toggleAssessmentRuleModal = () => {
    setIsAssessmentRuleModalVisible(pre => !pre);
  };
  const [isStartTestModalVisible, setIsStartTestModalVisible] = useState(false);
  const toggleStartTestModal = () => {
    setIsAssessmentRuleModalVisible(false);
    setIsStartTestModalVisible(pre => !pre);
  };

  const toggleResultModal = () => {
    setIsResultModalVisible(pre => !pre);
  };

  const [congratulationModalVisible, setCongratulationModalVisible] =
    useState(false);

  useEffect(() => {
    setIsLoading(true);

    axiosInstance
      .get('/enrollment/enrollment-test/mytests')
      .then(res => {
        if (res.data.success) {
          setItems(res.data.results);
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.log(
          'error you got /enrollment/enrollment-test/mytests ',
          JSON.stringify(error.response.data, null, 1),
        );
        setIsLoading(false);
      });
  }, []);

  const toggleCongratulationModal = () => {
    toggleStartTestModal(prev => !prev);
    setCongratulationModalVisible(pre => !pre);
  };

  const demoData = [
    {
      title: 'demo Mock exam',
      marks: 100,
      date: '15/01/24',
      duration: '1 hour',
    },
    {
      title: 'demo Mock exam',
      marks: 100,
      date: '15/01/24',
      duration: '1 hour',
    },
    {
      title: 'demo Mock exam',
      marks: 100,
      date: '15/01/24',
      duration: '1 hour',
    },
    {
      title: 'demo Mock exam',
      marks: 100,
      date: '15/01/24',
      duration: '1 hour',
    },
    {
      title: 'demo Mock exam',
      marks: 100,
      date: '15/01/24',
      duration: '1 hour',
    },
    {
      title: 'demo Mock exam',
      marks: 100,
      date: '15/01/24',
      duration: '1 hour',
    },
  ];

  if (isLoading) {
    return <Loading />;
  }
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Assessment</Text>
        <View style={styles.itemContainer}>
          {items?.length > 0 ? (
            items?.map((item, index) => (
              <View
                key={item?.program?._id || index}
                style={styles.mockExamContainer}>
                <View style={styles.folderIconContainer}>
                  <View style={styles.imgContainer}>
                    <Image
                      source={{
                        uri: 'https://s3-alpha-sig.figma.com/img/3b92/423b/b4fd6098272937deaec17deb2514af8d?Expires=1716163200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=U-RtDfLhxjV5gendtZYdeVgMDIdWWW6mR2Gc1g6J3CmNVm7Dgl1sSWJeuGRdaBekjKW1ou6hq-y7rc1M875UMx7pvtnz5s2I0QFtoDIVPCpImVNaHNU8B70fYlDZThgXsyrXOvFN178yoWwgNzkm~pDLlKpRgPjj8zktgNQCdROjxAnauD5Su8SjzB6eAVcd5CFbDoasjGDVvIi4VEpmGDIZy6q8sDz0RNfEj-xz9bYOGCbHhtBRyNrrKlzydzKe88iAWoL68DbUoIoMkQn~YdlaUUtmMeG3s2JsSPUQxWu5zJxJQNkSgkQnUEdfPkd~kEMtkIjBIiC7ipL5ZeRWWw__',
                      }}
                      style={styles.imgStyle}
                    />
                  </View>

                  <View>
                    <TouchableOpacity onPress={() => {}} style={styles.viewBtn}>
                      <Text style={styles.viewBtnText}>View Progress</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.mockExam}>{item?.program?.title}</Text>
                <Text style={styles.marks}>
                  Total Questions:{' '}
                  <Text style={styles.number}>
                    {item?.textQuestionQuantity}
                  </Text>
                </Text>
                <Text style={styles.marks}>
                  Date:{' '}
                  <Text style={styles.number}>
                    {item?.answeredAt
                      ? moment(item?.answeredAt).format('MMM DD, YYYY')
                      : 'Not Answered'}
                  </Text>
                </Text>
                <Text style={styles.marks}>
                  Duration:{' '}
                  <Text style={styles.number}>
                    {item?.totalTestTime} minutes
                  </Text>
                </Text>
                <View style={styles.line}></View>
                <View style={styles.btnArea}>
                  <MyButton
                    activeOpacity={!item?.status === 'submitted' ? 0.5 : 1}
                    onPress={() => {
                      item?.status === 'submitted'
                        ? null
                        : toggleAssessmentRuleModal();
                    }}
                    title={'Test Now'}
                    bg={
                      item?.status === 'submitted'
                        ? Colors.LightGreen
                        : Colors.Primary
                    }
                    colour={Colors.PureWhite}
                  />
                  <MyButton
                    activeOpacity={item?.status === 'submitted' ? 0.5 : 1}
                    onPress={() => {
                      item?.status === 'submitted' && toggleResultModal();
                    }}
                    title={'See Result'}
                    bg={
                      item?.status === 'submitted'
                        ? 'rgba(84, 106, 126, 1)'
                        : 'rgba(84, 106, 126, 0.2)'
                    }
                    colour={
                      item?.status === 'submitted'
                        ? Colors.PureWhite
                        : 'rgba(84, 106, 126, 1)'
                    }
                  />
                </View>
                {/** Modal start here **/}
              </View>
            ))
          ) : (
            <NoDataAvailable />
          )}
        </View>
        <AssessmentRulesModal
          toggleModal={toggleAssessmentRuleModal}
          isModalVisible={isAssessmentRuleModalVisible}
          toggleStartTestModal={toggleStartTestModal}
        />
        <StartTestModal
          isStartTestModalVisible={isStartTestModalVisible}
          toggleStartTestModal={toggleStartTestModal}
          toggleCongratulationModal={toggleCongratulationModal}
        />
        <CongratulationModal
          congratulationModalVisible={congratulationModalVisible}
          toggleCongratulationModal={toggleCongratulationModal}
          setCongratulationModalVisible={setCongratulationModalVisible}
        />
        <ResultModal
          toggleResultModal={toggleResultModal}
          isResultModalVisible={isResultModalVisible}
        />
      </ScrollView>
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    line: {
      borderBottomWidth: 1,
      borderBottomColor: Colors.LineColor,
      width: '100%',
      alignSelf: 'center',
    },
    container: {
      flex: 1,
      backgroundColor: Colors.Foreground,
      paddingHorizontal: responsiveScreenWidth(3),
      paddingVertical: responsiveScreenHeight(2),
      borderRadius: 10,
    },

    topContainer: {
      flexDirection: 'row',
      width: responsiveScreenWidth(100),
      height: responsiveScreenHeight(10),
      backgroundColor: Colors.Foreground,
    },

    arrowStyle: {
      marginTop: responsiveScreenHeight(0.3),
    },
    title: {
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      marginBottom: responsiveScreenHeight(1),
    },
    heading: {
      textAlign: 'center',
      fontSize: responsiveScreenFontSize(3),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.Heading,
      marginBottom: responsiveScreenHeight(2),
    },
    itemContainer: {
      width: responsiveScreenWidth(90),
      alignSelf: 'center',
      marginTop: responsiveScreenHeight(1),
      backgroundColor: Colors.Foreground,
      paddingHorizontal: responsiveScreenWidth(3),
      gap: 15,
    },

    mockExamContainer: {
      backgroundColor: Colors.Background_color,
      paddingHorizontal: responsiveScreenWidth(4),
      paddingTop: responsiveScreenHeight(2),

      borderRadius: responsiveScreenWidth(3),
    },
    folderIconContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    mockExam: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.1),
      color: Colors.Heading,
      fontWeight: '600',
      paddingBottom: responsiveScreenHeight(1.8),
      paddingTop: responsiveScreenHeight(1),
    },
    marks: {
      color: Colors.Heading,
      paddingBottom: responsiveScreenHeight(1),
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.MEDIUM,
    },
    number: {
      color: Colors.BodyText,
    },
    btnArea: {
      flexDirection: 'row',
      paddingHorizontal: responsiveScreenWidth(0.5),
      gap: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(2),
    },
    viewBtn: {
      backgroundColor: Colors.PrimaryOpacityColor,
      borderRadius: responsiveScreenWidth(2),
      marginTop: responsiveScreenHeight(1),
    },
    viewBtnText: {
      color: Colors.Primary,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      paddingHorizontal: responsiveScreenWidth(3),
      paddingVertical: responsiveScreenHeight(1),
    },
    imgStyle: {
      width: 40,
      height: 40,
    },
    imgContainer: {
      padding: responsiveScreenWidth(4.5),
      backgroundColor: Colors.Foreground,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      borderRadius: responsiveScreenWidth(50),
      marginBottom: responsiveScreenHeight(1),
    },
  });
