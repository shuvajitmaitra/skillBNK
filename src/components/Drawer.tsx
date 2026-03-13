import React, {useEffect, useRef} from 'react';
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  StyleSheet,
  Easing,
} from 'react-native';
import {useSelector} from 'react-redux';
import {DrawerContent} from '../screens/DrawerContent';
import {RootState} from '../types/redux/root';
import store from '../store';
import {toggleDrawer} from '../store/reducer/authReducer';
import {useTheme} from '../context/ThemeContext';

const {width} = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

const Drawer = () => {
  const Colors = useTheme();
  const {drawer} = useSelector((state: RootState) => state.auth);

  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (drawer) {
      slideAnim.setValue(-DRAWER_WIDTH);
      backdropAnim.setValue(0);

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 280,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0.5,
          duration: 280,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 220,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 220,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [drawer, slideAnim, backdropAnim]);
  if (!drawer) {
    return;
  }
  const closeDrawer = () => {
    store.dispatch(toggleDrawer());
  };

  return (
    <Modal
      transparent
      visible={drawer}
      animationType="none"
      onRequestClose={closeDrawer}>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={closeDrawer}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: backdropAnim,
              },
            ]}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.drawer,
            {
              width: DRAWER_WIDTH,
              backgroundColor: Colors.Background_color,
              transform: [{translateX: slideAnim}],
            },
          ]}>
          <DrawerContent />
        </Animated.View>
      </View>
    </Modal>
  );
};

export default Drawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    height: '100%',
  },
});
