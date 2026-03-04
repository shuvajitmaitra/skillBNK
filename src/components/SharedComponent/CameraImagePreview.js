import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import FullScreenModal from "./FullScreenModal";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import Images from "../../constants/Images";
import CrossIcon from "../../assets/Icons/CrossIcon";
import SendIcon from "../../assets/Icons/SendIcon";
import { useTheme } from "../../context/ThemeContext";

const CameraImagePreview = ({
  isVisible,
  gallery,
  togglePreview,
  handleSendCapturedPhoto,
  toggleCamera,
}) => {
  const Colors = useTheme();
  return (
    <FullScreenModal isVisible={isVisible}>
      <View style={styles.mainContainer}>
        <Image source={{ uri: gallery[0] }} style={styles.image} />
        <View style={styles.subContainer}>
          <TouchableOpacity
            style={[
              styles.buttonContainer,
              {
                alignSelf: "flex-start",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              },
            ]}
            onPress={() => togglePreview()}
          >
            <CrossIcon color={"white"} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleSendCapturedPhoto(gallery);
              togglePreview(), toggleCamera();
            }}
            style={[
              styles.buttonContainer,
              { alignSelf: "flex-end", backgroundColor: Colors.Primary },
            ]}
          >
            <SendIcon color={"white"} />
          </TouchableOpacity>
        </View>
      </View>
    </FullScreenModal>
  );
};

export default CameraImagePreview;

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 10,

    borderRadius: 100,
    margin: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  mainContainer: {
    // backgroundColor: "green",
    // // position: "relative",
    flex: 1,
    // width: responsiveWidth(100),
    // height: responsiveHeight(100),
  },
  subContainer: {
    // backgroundColor: "blue",
    position: "absolute",
    justifyContent: "space-between",
    height: "100%",
    width: "100%",
  },
});
