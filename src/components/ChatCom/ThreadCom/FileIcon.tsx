import React from 'react';
import {View, Image, ImageSourcePropType} from 'react-native';
import Images from '../../../constants/Images';

interface File {
  type: string;
}

interface FileIconProps {
  file: File;
}

const fileIcons: Record<string, ImageSourcePropType> = {
  'application/pdf': Images.PDF,
  'text/plain': Images.TEXT_FILE,
  'application/msword': Images.TEXT_FILE,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    Images.TEXT_FILE,
  'application/vnd.ms-excel': Images.SHEET,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    Images.SHEET,
  'application/zip': Images.ZIP,
  'application/x-zip-compressed': Images.ZIP,
};

const defaultIcon: ImageSourcePropType = Images.FOLDER;

const FileIcon: React.FC<FileIconProps> = ({file}) => {
  const iconSource =
    fileIcons[file.type as keyof typeof fileIcons] || defaultIcon;

  return (
    <View>
      <Image style={{height: 30, width: 30}} source={iconSource} />
    </View>
  );
};

export default FileIcon;
