import { StyleSheet, View, Image, Dimensions } from "react-native";
import React from "react";
import * as Animatable from "react-native-animatable";
import { responsiveHeight } from "react-native-responsive-dimensions";

const Marquee = ({ images, scrollSpeed = 30 }) => {
  const { width: windowWidth } = Dimensions.get("window");
  const imageWidth = 120;
  const totalImageWidth = images.length * imageWidth;
  const repeatTimes = Math.ceil(windowWidth / totalImageWidth) + 1;

  const repeatedImages = Array(repeatTimes).fill(images).flat();
  const totalScrollWidth = repeatedImages.length * imageWidth;
  const duration = (totalScrollWidth / scrollSpeed) * 1000;

  return (
    <View style={styles.container}>
      <Animatable.View
        animation={{
          from: { translateX: windowWidth },
          to: { translateX: -totalScrollWidth },
        }}
        duration={duration} // Adjust the speed of the scroll
        easing="linear"
        iterationCount="infinite"
        style={[styles.marqueeBox, { width: totalScrollWidth }]}
      >
        {repeatedImages.map((image, index) => (
          <Image
            key={`${image}-${index}`}
            style={styles.image}
            source={{
              uri: image,
              cache: "force-cache",
            }}
          />
        ))}
      </Animatable.View>
    </View>
  );
};

export default Marquee;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: responsiveHeight(6),
  },
  marqueeBox: {
    height: responsiveHeight(6),
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    height: 100,
    width: 120,
    resizeMode: "contain",
    marginRight: 60,
  },
});
