import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import ArrowDownThree from '../../assets/Icons/ArrowDownThree';
import PlusCircleIcon from '../../assets/Icons/PlusCircleIcon';
import CreateChatPopup from './Modal/CreateChatPopup';
import {TColors} from '../../types';
type ChatHeaderFilterProps = {
  checked: string;
  handleRadioChecked: (key: string) => void;
  handleFilterModalPress: () => void;
  toggleCreateCrowdModal: () => void;
};

const ChatHeaderFilter = ({
  checked,
  handleRadioChecked,
  handleFilterModalPress,
  toggleCreateCrowdModal,
}: ChatHeaderFilterProps) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [position, setPosition] = useState<{x: number; y: number} | null>(null);
  const tabs = [
    {label: 'Chats', key: 'chats'},
    {label: 'Crowds', key: 'crowds'},
    // { label: "Online", key: "onlines" },
    {label: 'Unread', key: 'unreadMessage'},
    {label: 'Mentioned', key: 'mention'},
  ];
  const handleSort = () => {
    if (checked === 'chats') {
      return 'Sort by';
    } else if (checked === 'pinned' || checked === 'favorites') {
      return 'Favorite';
    } else if (checked === 'onlines') {
      return 'Online';
    } else if (checked === 'archived') {
      return 'Archived';
    } else if (checked === 'unreadMessage') {
      return 'Unread';
    } else if (checked === 'mention') {
      return 'Mention';
    } else if (checked === 'crowds') {
      return 'Crowds';
    } else {
      return 'Sort by';
    }
  };

  return (
    <>
      {/* <View
        style={{
          flexDirection: 'row',
          gap: 5,
          paddingHorizontal: responsiveScreenWidth(4),
          marginBottom: 5,
          marginTop: 10,
        }}>
        <TouchableOpacity
          onPress={handleFilterModalPress}
          style={[
            styles.tabContainer,
            {
              backgroundColor: Colors.Primary,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            },
          ]}>
          <PlusCircleIcon />
          <Text style={styles.tabText}>Create Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleFilterModalPress}
          style={[
            styles.tabContainer,
            {
              backgroundColor: Colors.Primary,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            },
          ]}>
          <PlusCircleIcon />
          <Text style={styles.tabText}>Create Crowd</Text>
        </TouchableOpacity>
      </View> */}

      <View style={styles.headerTabContainer}>
        {Boolean(position) && (
          <CreateChatPopup
            toggleCreateCrowdModal={toggleCreateCrowdModal}
            position={position}
            setPosition={setPosition}
          />
        )}
        <TouchableOpacity
          onPress={(event: any) => {
            setPosition({
              x: event.nativeEvent.pageX,
              y: event.nativeEvent.pageY,
            });
          }}
          style={[
            styles.tabContainer,
            {
              backgroundColor: Colors.Primary,
              flexDirection: 'row',
              alignItems: 'center',
            },
          ]}>
          <PlusCircleIcon size={19} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleFilterModalPress}
          style={[
            styles.tabContainer,
            {
              backgroundColor: Colors.Primary,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            },
          ]}>
          <ArrowDownThree />
          <Text style={styles.tabText}>{handleSort()}</Text>
        </TouchableOpacity>
        <Text
          style={{
            color: Colors.BodyText,
            fontSize: 25,
            justifyContent: 'flex-start',
          }}>
          |
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{gap: 5}}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => handleRadioChecked(tab.key)}
              style={[
                styles.tabContainer,
                {
                  backgroundColor:
                    checked === tab.key
                      ? Colors.Primary
                      : Colors.PrimaryOpacityColor,
                },
              ]}>
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      checked === tab.key ? Colors.PureWhite : Colors.Primary,
                  },
                ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

export default ChatHeaderFilter;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    tabText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
    },
    tabContainer: {
      paddingHorizontal: 10,
      backgroundColor: Colors.PrimaryOpacityColor,
      borderRadius: 100,
      paddingVertical: 5,
    },
    headerTabContainer: {
      flexDirection: 'row',
      gap: 5,
      // paddingTop: 5,
      paddingHorizontal: responsiveScreenWidth(4),
      marginVertical: 10,
      alignItems: 'flex-end',
    },
  });
