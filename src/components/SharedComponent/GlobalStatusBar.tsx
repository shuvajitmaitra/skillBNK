import {StatusBar} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import {StatusBarStyle} from 'react-native';

const GlobalStatusBar = ({color}: {color?: string}) => {
  const STYLES = ['default', 'dark-content', 'light-content'] as const;
  const [statusBarStyle, setStatusBarStyle] = useState<StatusBarStyle>(
    STYLES[0],
  );
  const Colors = useTheme();
  useEffect(() => {
    setStatusBarStyle('light-content');
  }, []);

  return (
    <StatusBar
      translucent={true}
      backgroundColor={color || Colors.Background_color}
      barStyle={statusBarStyle}
    />
  );
};

export default GlobalStatusBar;
