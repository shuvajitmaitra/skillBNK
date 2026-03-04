import {StyleSheet, ScrollView, View, ActivityIndicator} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import axiosInstance from '../../utility/axiosInstance';
import {useTheme} from '../../context/ThemeContext';
import CommentField from '../../components/CommentCom/CommentField';
import TextRender from '../../components/SharedComponent/TextRender';

export default function PresentationDetailsView({route}) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const params = route.params;
  const [isLoading, setIsLoading] = React.useState(true);
  const [content, setContent] = React.useState();
  const [slides, setSlides] = useState([]);

  React.useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        let cnt = await axiosInstance.get(
          `/content/getcontent/${params?.contentId}`,
        );
        setContent(cnt.data.content?.description);
        setSlides(cnt.data?.content?.slide?.slides);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(
          'error to get document',
          JSON.stringify(error.response.data, null, 1),
        );
      }
    })();
  }, [params?.contentId]);
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

  console.log('content', JSON.stringify(content, null, 1));

  return (
    <View style={styles.container}>
      <ScrollView>
        <TextRender text={content} />
        {slides && <CommentField postId={params?.contentId} />}
      </ScrollView>
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    title: {
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.2),
      marginTop: responsiveScreenHeight(2),
      alignSelf: 'center',
    },
    container: {
      padding: 10,
      backgroundColor: Colors.Background_color,
      flex: 1,
    },
  });
