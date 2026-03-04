import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import faqIcon from '../../assets/Images/faq.png';
const FrequentlyAsked = ({faqs}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [openFaq, setOpenFaq] = useState(null);
  const [displayCount, setDisplayCount] = useState(4);

  const dataToDisplay = faqs.slice(0, displayCount);

  const handleOpenDescription = faqId => {
    setOpenFaq(openFaq === faqId ? null : faqId);
  };

  const renderFaqItem = item => (
    <View key={item._id} style={styles.accordionContainer}>
      <TouchableOpacity
        onPress={() => handleOpenDescription(item._id)}
        style={[
          styles.accordion,
          openFaq === item._id
            ? styles.activeAccordion
            : styles.inactiveAccordion,
        ]}>
        <Text
          style={[
            styles.accordionTitleText,
            openFaq === item._id
              ? styles.activeAccordionText
              : styles.inactiveAccordionText,
          ]}>
          {item.question}
        </Text>
        <View
          style={
            openFaq === item._id
              ? styles.activeIconContainer
              : styles.inActiveIconContainer
          }>
          <AntDesign
            name={openFaq === item._id ? 'minus' : 'plus'}
            size={20}
            color={openFaq === item._id ? Colors.PureWhite : Colors.Primary}
          />
        </View>
      </TouchableOpacity>
      {openFaq === item._id && (
        <Text style={styles.AccordionDescription}>{item.answer}</Text>
      )}
    </View>
  );

  const handleShowMoreOrLess = () => {
    if (displayCount >= faqs?.length) {
      setDisplayCount(4);
    } else {
      const nextCount = displayCount + 4;
      setDisplayCount(Math.min(nextCount, faqs?.length));
    }
  };

  return (
    dataToDisplay?.length > 0 && (
      <View style={styles.container}>
        <Text style={styles.titleText}>Frequently Asked Questions</Text>

        {dataToDisplay.map(item => renderFaqItem(item))}

        <TouchableOpacity
          onPress={handleShowMoreOrLess}
          style={styles.showMoreButton}>
          <Text style={styles.showMoreButtonText}>
            {displayCount >= faqs.length ? 'See Less' : 'See More'}
          </Text>
        </TouchableOpacity>

        <View style={styles.imageContainer}>
          <Image style={styles.image} source={faqIcon} />
        </View>
      </View>
    )
  );
};

export default FrequentlyAsked;

const getStyles = Colors =>
  StyleSheet.create({
    imageContainer: {
      width: '100%',
      alignItems: 'center',
      marginTop: 30,
    },
    image: {
      height: 390,
      width: '100%',
      resizeMode: 'contain',
    },
    showMoreButton: {
      backgroundColor: Colors.Primary,
      borderRadius: 50,
      width: responsiveWidth(30),
      marginTop: 20,
    },

    showMoreButtonText: {
      fontFamily: CustomFonts.MEDIUM,
      textAlign: 'center',
      color: Colors.PureWhite,
      paddingVertical: 8,
      fontSize: responsiveFontSize(2),
    },
    AccordionDescription: {
      color: Colors.BodyText,
      padding: 15,
      fontFamily: CustomFonts.REGULAR,
      lineHeight: responsiveHeight(2.5),
      fontSize: responsiveFontSize(1.8),
    },
    accordionContainer: {
      backgroundColor: Colors.Foreground,
      marginBottom: 10,
      borderRadius: 10,
      overflow: 'hidden',
    },
    activeIconContainer: {
      height: 30,
      width: 30,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.ForegroundOpacityColor,
    },
    inActiveIconContainer: {
      height: 30,
      width: 30,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.PrimaryOpacityColor,
    },
    container: {
      flex: 1,
      paddingVertical: 25,
      paddingHorizontal: 20,
      // backgroundColor: "green",
    },
    titleText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveFontSize(3),
      color: Colors.Heading,
      marginBottom: 30,
    },
    accordionTitleText: {
      flex: 1,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveFontSize(2),
      lineHeight: responsiveHeight(2.5),
      flexWrap: 'wrap',
    },
    accordion: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingVertical: 20,
      borderRadius: 10,
      gap: 5,
      justifyContent: 'space-between',
    },
    activeAccordion: {
      backgroundColor: Colors.Primary,
    },
    inactiveAccordion: {
      backgroundColor: Colors.Foreground,
    },
    activeAccordionText: {
      color: Colors.PureWhite,
    },
    inactiveAccordionText: {
      color: Colors.Heading,
    },
  });
