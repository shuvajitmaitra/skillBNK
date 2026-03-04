import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setSocketStatus} from '../../store/reducer/chatReducer';
import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';

const SocketStatus = () => {
  const {socketStatus} = useSelector(state => state.chat);
  const Colors = useTheme();
  const dispatch = useDispatch();
  setTimeout(() => {
    dispatch(setSocketStatus('running'));
  }, 200);
  useEffect(() => {
    console.log('socketStatus', JSON.stringify(socketStatus, null, 1));
  }, []);
  return (
    <View>
      {socketStatus === true ? (
        <View
          style={{
            backgroundColor: Colors.Primary,
            alignItems: 'center',
          }}>
          <Text
            style={{fontFamily: CustomFonts.MEDIUM, color: Colors.PureWhite}}>
            Online
          </Text>
        </View>
      ) : socketStatus === 'running' ? (
        <View></View>
      ) : (
        <View
          style={{
            backgroundColor: Colors.ThemeSecondaryColor,
            alignItems: 'center',
          }}>
          <Text
            style={{fontFamily: CustomFonts.MEDIUM, color: Colors.PureWhite}}>
            waiting for network
          </Text>
        </View>
      )}
    </View>
  );
};

export default SocketStatus;

const styles = StyleSheet.create({});
