import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import Feather from 'react-native-vector-icons/Feather';
import Popover from 'react-native-popover-view';
import CrossIcon from '../../assets/Icons/CrossIcon';
import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';
import GlobalRadioGroup from './GlobalRadioButton';
import {TColors} from '../../types';
import {Rect} from 'react-native-popover-view/dist/Types';
import CrossCircle from '../../assets/Icons/CrossCircle';
import {fontSizes, gFontSize, gHeight} from '../../constants/Sizes';
import {theme} from '../../utility/commonFunction';

const Icon = Feather as any;

export interface Option {
  label: string;
  value: string | number;
}

interface SearchAndFilterProps {
  setSearchText: (text: string) => void;
  handleFilter: (value: string) => void;
  filterValue: string;
  setFilterValue: (value: string) => void;
  itemList: Option[];
  searchText: string;
  placeholderText?: string;
  handleSearch: (text: string) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  setSearchText,
  handleFilter,
  filterValue,
  setFilterValue,
  itemList,
  searchText,
  placeholderText = 'Search...',
  handleSearch,
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [position, setPosition] = useState<{x: number; y: number} | null>(null);

  useEffect(() => {
    console.log('rendered');
  }, []);

  const handleRadioChange = (value: string | number) => {
    setFilterValue(value.toString());
    handleFilter(value.toString());
    setPosition(null);
  };

  return (
    <View style={styles.topContainer}>
      <View style={styles.inputField}>
        <TextInput
          keyboardAppearance={theme()}
          value={searchText}
          style={[
            styles.textInput,
            {
              paddingVertical:
                Platform.OS === 'ios'
                  ? responsiveScreenHeight(1.5)
                  : responsiveScreenHeight(1),
            },
          ]}
          placeholder={placeholderText}
          placeholderTextColor={Colors.BodyText}
          onChangeText={text => {
            setSearchText(text);
            handleSearch(text);
          }}
        />
        <TouchableOpacity
          onPress={() => {
            setSearchText('');
          }}>
          {searchText.length > 0 ? (
            <CrossCircle size={gFontSize(20)} />
          ) : (
            <Icon style={styles.inputFieldIcon} name="search" />
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={(event: any) => {
          setPosition({x: event.nativeEvent.pageX, y: event.nativeEvent.pageY});
        }}
        activeOpacity={0.8}
        style={styles.filterButton}>
        <Icon
          name="filter"
          size={24}
          color={Colors.PureWhite}
          style={styles.filterButtonIcon}
        />
        <Text style={styles.filterButtonText}>Filters</Text>
      </TouchableOpacity>

      <Popover
        // isVisible={isPopoverVisible}
        // fromView={filterButtonRef.current as any}
        // onRequestClose={() => setIsPopoverVisible(false)}
        // placement={Placement.BOTTOM}
        // backgroundStyle={{backgroundColor: Colors.BackDropColor}}
        // arrowStyle={styles.popupArrow}
        // popoverStyle={styles.popupContent}
        // supportedOrientations={['portrait', 'landscape']}

        backgroundStyle={{backgroundColor: Colors.BackDropColor}}
        popoverStyle={styles.popoverStyle}
        from={new Rect(position?.x ?? 0, position?.y ?? 0, 0, 0)}
        isVisible={Boolean(position)}
        onRequestClose={() => setPosition(null)}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Filters</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setPosition(null)}>
              <View style={styles.cancelButton}>
                <CrossIcon />
              </View>
            </TouchableOpacity>
          </View>

          <GlobalRadioGroup
            options={itemList}
            onSelect={handleRadioChange}
            selectedValue={filterValue}
          />
        </View>
      </Popover>
    </View>
  );
};

export default SearchAndFilter;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    popoverStyle: {
      backgroundColor: Colors.Foreground,
      padding: 15,
      borderRadius: 7,
    },
    // Radio Button Styles
    radioButton: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    buttonGroup: {
      marginHorizontal: responsiveScreenWidth(-1),
    },
    radioText: {
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.REGULAR,
    },
    // Header Styles
    headerText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Heading,
    },
    cancelButton: {
      backgroundColor: Colors.Background_color,
      padding: responsiveScreenWidth(2),
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: responsiveScreenHeight(1),
    },
    topContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: responsiveScreenWidth(2.2),
      alignItems: 'center',
    },
    // Filter Button Styles
    filterButton: {
      flexDirection: 'row',
      backgroundColor: Colors.Primary,
      alignItems: 'center',
      gap: responsiveScreenWidth(2.6),
      height: gHeight(40),
      paddingHorizontal: responsiveScreenWidth(4),
      borderRadius: responsiveScreenWidth(1.5),
    },
    inputField: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: Colors.ScreenBoxColor,
      paddingHorizontal: responsiveScreenWidth(3.3),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      flex: 1,
      borderRadius: responsiveScreenWidth(2),
      height: gHeight(40),
    },
    inputFieldIcon: {
      fontSize: fontSizes.heading,
      color: Colors.BodyText,
    },
    textInput: {
      color: Colors.Heading,
      fontSize: fontSizes.body,
      flex: 1,
      fontFamily: CustomFonts.REGULAR,
    },
    filterButtonIcon: {
      fontSize: responsiveScreenFontSize(2),
      color: Colors.PureWhite,
    },
    filterButtonText: {
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.PureWhite,
    },
    threeDotIcon: {
      paddingHorizontal: responsiveScreenWidth(1),
    },
    buttonText: {
      fontSize: responsiveScreenFontSize(2),
      color: '#666',
    },
    iconAndTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(3),
    },
    buttonContainer: {
      paddingVertical: responsiveScreenHeight(1.5),
      paddingHorizontal: responsiveScreenWidth(1.5),
      borderBottomWidth: 1,
      borderBottomColor: Colors.BorderColor,
    },
    // Popover Styles
    popupContent: {
      padding: 16,
      backgroundColor: Colors.Foreground,
      borderRadius: 8,
      minWidth: responsiveScreenWidth(50),
      minHeight: responsiveScreenHeight(19),
    },
    popupArrow: {
      // react-native-popover-view handles the arrow automatically
    },
    container: {
      minWidth: responsiveScreenWidth(50),
    },
  });
