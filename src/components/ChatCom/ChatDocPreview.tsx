import React from 'react';
import {View, ScrollView, Image, StyleSheet} from 'react-native';
import RNText from '../SharedComponent/RNText';
import {PressableScale} from '../SharedComponent/PressableScale';
import CrossIcon from '../../assets/Icons/CrossIcon';
import {MaterialCommunityIcon} from '../../constants/Icons';

type TAsset = {
  name: string;
  size: number;
  type: string;
  url: string;
};

const formatSize = (size: number) => {
  if (size < 1024) return size + ' B';
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
  return (size / (1024 * 1024)).toFixed(1) + ' MB';
};

const getFileIcon = (type: string) => {
  if (type.startsWith('audio'))
    return {name: 'file-music-outline', color: '#8b5cf6'};

  if (type === 'application/pdf')
    return {name: 'file-pdf-box', color: '#ef4444'};

  if (type.includes('word')) return {name: 'file-word-box', color: '#2563eb'};

  if (type.includes('excel')) return {name: 'file-excel-box', color: '#16a34a'};

  if (type.includes('powerpoint'))
    return {name: 'file-powerpoint-box', color: '#f97316'};

  return {name: 'file-outline', color: '#6b7280'};
};

const isImage = (type: string) => type.startsWith('image');

const ChatDocPreview = ({
  chatInfo,
  onRemove,
}: {
  chatInfo: any;
  onRemove: (idx: number) => void;
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        {chatInfo.files.map((file: TAsset, idx: number) => {
          const imageFile = isImage(file.type);

          const icon = getFileIcon(file.type);
          return (
            <View key={idx} style={styles.card}>
              {imageFile ? (
                <Image source={{uri: file.url}} style={styles.image} />
              ) : (
                <View style={styles.filePreview}>
                  <MaterialCommunityIcon
                    name={icon.name}
                    size={36}
                    color={icon.color}
                  />
                </View>
              )}

              <View style={styles.info}>
                <RNText numberOfLines={1} style={styles.name}>
                  {file.name}
                </RNText>

                <RNText style={styles.size}>{formatSize(file.size)}</RNText>
              </View>

              <PressableScale
                style={styles.removeBtn}
                onPress={() => onRemove(idx)}>
                <CrossIcon color="red" />
              </PressableScale>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default ChatDocPreview;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },

  scroll: {
    paddingHorizontal: 10,
    gap: 12,
  },

  card: {
    width: 95,
    borderRadius: 14,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 2,
  },

  image: {
    width: '100%',
    height: 70,
  },

  filePreview: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F4F7',
  },

  fileIcon: {
    fontSize: 28,
  },

  info: {
    padding: 6,
  },

  name: {
    fontSize: 11,
  },

  size: {
    fontSize: 10,
    opacity: 0.6,
  },

  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
});
