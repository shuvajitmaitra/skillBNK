import React from 'react';
import {StatusBar, StatusBarStyle} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {storage} from '../../utility/mmkvInstance';

type GlobalStatusBarProps = {
  backgroundColor?: string;
  translucent?: boolean;
  barStyle?: StatusBarStyle;
};

const GlobalStatusBar = ({
  backgroundColor,
  translucent = true,
  barStyle,
}: GlobalStatusBarProps) => {
  const Colors = useTheme();
  const theme = storage?.getString('displayMode');

  const resolvedBarStyle: StatusBarStyle =
    barStyle || (theme === 'light' ? 'dark-content' : 'light-content');

  return (
    <StatusBar
      translucent={translucent}
      backgroundColor={backgroundColor || Colors.Background_color}
      barStyle={resolvedBarStyle}
    />
  );
};

export default React.memo(GlobalStatusBar);
