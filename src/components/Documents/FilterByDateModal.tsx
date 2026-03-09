import React from 'react';
import ReactNativeModal from 'react-native-modal';
import {Calendar} from 'react-native-calendars';
import {MaterialIcon} from '../../constants/Icons';
import {useTheme} from '../../context/ThemeContext';
import moment from 'moment';
import {PressableScale} from '../SharedComponent/PressableScale';
import RNText from '../SharedComponent/RNText';
import CustomFonts from '../../constants/CustomFonts';
type Props = {
  isVisible: boolean;
  selectedDate: string;
  onClose: () => void;
  onSelect: (date: string) => void;
  onClear: () => void;
};

const FilterByDateModal = React.memo(
  ({isVisible, selectedDate, onClose, onSelect, onClear}: Props) => {
    const Colors = useTheme();
    const date = selectedDate && moment(selectedDate).format('YYYY-MM-DD');
    if (!isVisible) return;
    return (
      <ReactNativeModal isVisible={isVisible} onBackdropPress={onClose}>
        <Calendar
          renderArrow={(direction: 'left' | 'right') =>
            direction === 'left' ? (
              <MaterialIcon
                name="chevron-left"
                size={30}
                color={Colors.BodyText}
              />
            ) : (
              <MaterialIcon
                name="chevron-right"
                size={30}
                color={Colors.BodyText}
              />
            )
          }
          theme={{
            calendarBackground: Colors.Background_color,
            selectedDayBackgroundColor: Colors.Primary,
            selectedDayTextColor: Colors.PureWhite,
            todayTextColor: Colors.Primary,
            todayBackgroundColor: Colors.PrimaryOpacityColor,
            dayTextColor: Colors.Heading,
            textDisabledColor: Colors.datePickerDisableTextColor,
            arrowColor: 'red',
            monthTextColor: Colors.Heading,
            textSectionTitleColor: Colors.Heading,
            textDayFontWeight: '500',
            textMonthFontWeight: '600',
          }}
          enableSwipeMonths={true}
          disableMonthChange={true}
          onDayPress={(day: {
            year: number;
            month: number;
            day: number;
            dateString: string;
          }) => {
            onSelect(
              moment
                .utc({
                  year: day.year,
                  month: day.month - 1,
                  date: day.day,
                })
                .toISOString(),
            );
          }}
          markedDates={{
            [date]: {
              selected: true,
              disableTouchEvent: true,
            },
          }}
        />
        {selectedDate && (
          <PressableScale
            style={{
              backgroundColor: Colors.Red,
              height: 50,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={onClear}>
            <RNText
              style={{color: Colors.PureWhite, fontFamily: CustomFonts.MEDIUM}}>
              Clear Filter
            </RNText>
          </PressableScale>
        )}
      </ReactNativeModal>
    );
  },
);

export default FilterByDateModal;
