// //---------------------------------------------------
// //--------------- Do not delete without reading code  ------------------------------------
// //----------------- There is some necessary code of Purchased Screen----------------------------------
// //---------------------------------------------------
// import {StatusBar, StyleSheet, View} from 'react-native';
// import React from 'react';
// import {
//   responsiveScreenFontSize,
//   responsiveScreenHeight,
//   responsiveScreenWidth,
// } from 'react-native-responsive-dimensions';
// import CustomFonts from '../../constants/CustomFonts';
// import {useTheme} from '../../context/ThemeContext';
// import CustomTabView from '../../components/PurchasedCom/CustomTabView';
// import {TColors} from '../../types';
// import MyCourses from '../../components/PurchasedCom/MyCourses';

// const PurchasedScreen = () => {
//   //---------------------------------------------------
//   //--------------- Do not delete without reading code  ------------------------------------
//   //----------------- There is some necessary code of Purchased Screen----------------------------------
//   //---------------------------------------------------
//   const Colors = useTheme();
//   const styles = getStyles(Colors);
//   return (
//     <View style={styles.container}>
//       <StatusBar
//         translucent={true}
//         backgroundColor={Colors.Background_color}
//       />
//       {/* <Text style={styles.headingText}>Purchased Item</Text>
//       <Text style={styles.subHeading}>Explore Your Learning and Services</Text> */}
//       {/* <Divider /> */}
//       <CustomTabView />
//       <MyCourses />
//     </View>
//     //
//     //---------------------------------------------------
//     //--------------- Do not delete without reading code  ------------------------------------
//     //----------------- There is some necessary code of Purchased Screen----------------------------------
//     //---------------------------------------------------
//     //
//   );
// };

// export default PurchasedScreen;

// const getStyles = (Colors: TColors) =>
//   StyleSheet.create({
//     headingText: {
//       fontFamily: CustomFonts.SEMI_BOLD,
//       fontSize: responsiveScreenFontSize(2.4),
//       color: Colors.Heading,
//       // paddingBottom: responsiveScreenHeight(1),
//     },
//     container: {
//       flex: 1,
//       paddingHorizontal: responsiveScreenWidth(4.5),
//       // paddingVertical: responsiveScreenWidth(3),
//       backgroundColor: Colors.Background_color,
//       // minHeight: "100%",
//     },
//     subHeading: {
//       fontFamily: CustomFonts.REGULAR,
//       fontSize: responsiveScreenFontSize(1.6),
//       color: Colors.BodyText,
//       paddingBottom: responsiveScreenHeight(1.5),
//     },
//   });

import React from 'react';
import MyCourses from '../../components/PurchasedCom/MyCourses';

const PurchasedScreen = () => {
  return <MyCourses />;
};

export default PurchasedScreen;
