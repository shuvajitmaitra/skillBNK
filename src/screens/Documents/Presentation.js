import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';

import CustomFonts from '../../constants/CustomFonts';
import LockIcon from '../../assets/Icons/LockIcon';
import axiosInstance from '../../utility/axiosInstance';
import {useTheme} from '../../context/ThemeContext';
import NoDataAvailable from '../../components/SharedComponent/NoDataAvailable';
import {RegularFonts} from '../../constants/Fonts';
import {formattingDate, theme} from '../../utility/commonFunction';

export default function Presentation() {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const [isLoading, setIsLoading] = React.useState(false);
  const [contents, setContents] = React.useState([]);
  const [records, setRecords] = React.useState([]);
  const [search, setSearch] = React.useState(null);

  const navigation = useNavigation();

  const handleNavigation = contentId => {
    navigation.navigate('PresentationDetailsView', {contentId: contentId});
  };
  const handleProgramNavigation = () => {
    navigation.navigate('ProgramStack', {screen: 'Program'});
  };
  const handleSearch = text => {
    const filteredContents = records?.filter(item =>
      item.name.toLowerCase().includes(text.toLowerCase()),
    );
    setContents(filteredContents);
    setSearch(text);
  };

  React.useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        let rescontent = await axiosInstance.get('/content/labcontent');
        setContents(rescontent.data.contents);
        setRecords(rescontent.data.contents);
        setIsLoading(false);
        // console.log("Contents data:", JSON.stringify(contents, null, 2));
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    })();
  }, []);

  const DocumentItem = ({title, date, id, thumbnail, update}) => {
    console.log('thumbnail', JSON.stringify(thumbnail, null, 1));
    return (
      <TouchableOpacity
        onPress={() => handleNavigation(id)}
        activeOpacity={0.8}
        style={styles.documentItemContainer}>
        <Image
          style={styles.documentImg}
          source={
            !thumbnail
              ? require('../../assets/ApplicationImage/MainPage/Presentation/document1.png')
              : {uri: thumbnail}
          }
        />

        <View style={styles.documentDetails}>
          <Text style={styles.documentTitle}>{title}</Text>
          <Text style={styles.documentDate}>{formattingDate(date)}</Text>
          {/* <Text style={styles.documentDate}>{formatingDate(update)}</Text> */}
          <View style={styles.readDocContainer}>
            <Text style={styles.readDoc}>Read Document</Text>
            <AntDesign
              style={styles.readDocArrow}
              name="arrowright"
              size={20}
              color={Colors.Primary}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const LockDocumentItem = ({title, date, update}) => {
    return (
      <View style={styles.documentItemContainer}>
        <ImageBackground
          style={styles.documentImg}
          source={require('../../assets/ApplicationImage/MainPage/Presentation/document1.png')}>
          <View style={styles.lockDocumentImg}>
            <LockIcon />
          </View>
        </ImageBackground>
        <View style={styles.documentDetails}>
          <Text style={styles.documentTitle}>{title}</Text>
          <Text style={styles.documentDate}>{formattingDate(date)}</Text>
          {/* <Text style={styles.documentDate}>{formateDate(update)}</Text> */}
          <View style={styles.readDocContainer}>
            <Text style={styles.readDocLocked}>Locked</Text>
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.Foreground,
        }}>
        <ActivityIndicator size={50} animating={true} color={Colors.Primary} />
      </View>
    );
  }

  // console.log("contents", JSON.stringify(contents, null, 1));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Documents and Labs</Text>
      <Text style={styles.subHeading}>
        Easy Access to Course Documents & Labs
      </Text>
      <View style={styles.searchBoxContainer}>
        <View style={styles.searchBox}>
          <TextInput
            keyboardAppearance={theme()}
            onChangeText={handleSearch}
            style={styles.search}
            placeholder="Search..."
            placeholderTextColor={Colors.BodyText}
          />
          <AntDesign name="search1" size={22} color={Colors.BodyText} />
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            handleProgramNavigation();
          }}
          style={styles.searchFilter}>
          <Text style={styles.buttonText}>Go to Bootcamp</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          {contents.length > 0 ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{marginBottom: responsiveScreenHeight(2), gap: 20}}>
                {contents.map(item => {
                  if (item.isLocked) {
                    return (
                      <LockDocumentItem
                        key={item?._id}
                        title={item.name}
                        date={item.createdAt}
                        update={item.updateAt}
                        thumbnail={item.thumbnail}
                      />
                    );
                  } else {
                    return (
                      <DocumentItem
                        key={item?._id}
                        id={item?._id}
                        title={item.name}
                        date={item.createdAt}
                        update={item.updateAt}
                        thumbnail={item.thumbnail}
                      />
                    );
                  }
                })}
              </View>
            </ScrollView>
          ) : (
            <NoDataAvailable />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      // paddingTop: responsiveScreenHeight(7),
      paddingHorizontal: responsiveScreenWidth(4),
      backgroundColor: Colors.Background_color,
    },
    title: {
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: RegularFonts.HL,
    },
    searchBoxContainer: {
      flexDirection: 'row',
      marginVertical: responsiveScreenHeight(2),
      justifyContent: 'space-between',
      gap: responsiveScreenWidth(2),
      alignItems: 'center',
    },
    searchBox: {
      height: responsiveScreenHeight(5.5),
      backgroundColor: Colors.Foreground,
      borderRadius: 10,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingRight: responsiveScreenWidth(3),
      flex: 0.65,
    },
    searchFilter: {
      width: responsiveScreenWidth(12),
      height: responsiveScreenHeight(5),
      backgroundColor: Colors.Primary,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      flex: 0.35,
    },
    buttonText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
    },
    search: {
      flex: 1,
      height: responsiveScreenHeight(5.5),
      paddingLeft: responsiveScreenWidth(4),
      color: Colors.Heading,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
    },
    documentItemContainer: {
      width: responsiveScreenWidth(92),
      paddingVertical: responsiveScreenHeight(2),
      backgroundColor: Colors.Foreground,
      alignSelf: 'center',
      borderRadius: 5,
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      flexDirection: 'row',
      paddingHorizontal: responsiveScreenWidth(4),
    },
    documentImg: {
      width: responsiveScreenWidth(22),
      height: responsiveScreenWidth(22),
      resizeMode: 'contain',
      borderRadius: 50,
      overflow: 'hidden',
    },
    lockDocumentImg: {
      width: responsiveScreenWidth(22),
      height: responsiveScreenWidth(22),
      backgroundColor: Colors.Heading,
      borderRadius: 50,
      opacity: 0.8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    documentDetails: {
      width: responsiveScreenWidth(55),
      marginLeft: responsiveScreenWidth(3),
    },
    documentTitle: {
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.8),
    },
    documentDate: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
      marginTop: responsiveScreenHeight(0.5),
    },
    readDocContainer: {
      flexDirection: 'row',
      marginTop: responsiveScreenHeight(0.5),
      alignItems: 'center',
    },
    readDoc: {
      color: Colors.Primary,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
      marginRight: responsiveScreenWidth(1),
      marginBottom: 1,
    },
    readDocLocked: {
      color: Colors.Red,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
      marginRight: responsiveScreenWidth(1),
      marginBottom: 1,
    },

    // popupContent: {
    //   padding: 16,
    //   backgroundColor: Colors.Foreground,
    //   borderRadius: 8,
    //   width: responsiveScreenWidth(50),
    //   height: responsiveScreenHeight(23),
    //   position: "absolute",
    //   top: responsiveScreenHeight(-3),
    // },
    // popupArrow: {
    //   borderTopColor: Colors.Foreground,
    //   position: "absolute",
    //   marginTop: responsiveScreenHeight(-3),
    // },
    // popupContryText: {
    //   fontFamily: CustomFonts.SEMI_BOLD,
    //   marginBottom: responsiveScreenHeight(0.4),
    //   fontSize: responsiveScreenFontSize(1.9),
    //   marginLeft: responsiveScreenWidth(2),
    //   color: Colors.Heading,
    // },
    // popupOption: {
    //   flexDirection: "row",
    //   alignItems: "center",
    //   marginTop: responsiveScreenHeight(0.8),
    // },
    // popUpcheckbox: {
    //   borderRadius: 50,
    //   marginRight: responsiveScreenWidth(2),
    //   width: responsiveScreenWidth(4.5),
    //   height: responsiveScreenWidth(4.5),
    // },
    // popUpcheckboxText: {
    //   fontFamily: CustomFonts.REGULAR,
    //   fontSize: responsiveScreenFontSize(1.7),
    // },

    // radioContainer: {
    //   flexDirection: "row",
    //   alignItems: "center",
    // },
    // radioText: {
    //   fontFamily: CustomFonts.REGULAR,
    //   fontSize: responsiveScreenFontSize(1.7),
    //   color: Colors.Heading,
    // },
    subHeading: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.BodyText,
    },
  });
