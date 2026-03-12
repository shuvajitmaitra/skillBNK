import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {RootState} from '../../types/redux/root';
import {useDispatch, useSelector} from 'react-redux';
import TextRender from '../../components/SharedComponent/TextRender';
import {borderRadius, fontSizes, gFontSize, gGap} from '../../constants/Sizes';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
import {
  AntDesignIcon,
  EntypoIcon,
  FeatherIcon,
  FoundationIcon,
} from '../../constants/Icons';
import moment from 'moment';
import Divider2 from '../../components/SharedComponent/Divider2';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import NotesPopup from '../../components/Notes/NotesPopup';
import {selectNote} from '../../store/reducer/notesReducer';
import {handleDeleteNote} from '../../actions/myNoteApiCall';
import {convertSize} from '../../utility/commonFunction';
import {navigate} from '../../navigation/NavigationService';
import CustomFonts from '../../constants/CustomFonts';
import {handleOpenLink} from '../../components/HelperFunction';

const NoteDetails = () => {
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {top, bottom} = useSafeAreaInsets();
  const navigation = useNavigation();
  const {selectedNote} = useSelector((state: RootState) => state.notes);
  const [attachmentVisible, setAttachmentVisible] = useState(true);
  //   console.log(selectedNote);
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: gGap(10),
        backgroundColor: Colors.Background_color,
        paddingTop: top,
        paddingBottom: bottom / 2,
      }}>
      <ScrollView>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.Foreground,
            borderWidth: 1,
            borderColor: Colors.BorderColor,
            padding: 5,
            borderRadius: 100,
            position: 'absolute',
            zIndex: 1,
            // top: 5,
          }}>
          <AntDesignIcon
            onPress={() => {
              if (selectedNote?._id) {
                dispatch(selectNote(null));
              }
              navigation.goBack();
            }}
            name={'arrowleft'}
            size={27}
            color={Colors.BodyText}
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.titleText}>
            <View
              style={{
                width: gGap(50),
                height: gGap(30),
                // backgroundColor: 'red',
              }}
            />
            {selectedNote?.title}
          </Text>

          <TouchableOpacity
            style={{
              position: 'absolute',
              zIndex: 10,
              right: -0,
              paddingBottom: 10,
            }}>
            <EntypoIcon
              onPress={(event: any) => {
                dispatch(
                  selectNote({
                    ...selectNote,
                    x: event.nativeEvent.pageX,
                    y: event.nativeEvent.pageY,
                  }),
                );
              }}
              name={'dots-three-vertical'}
              size={25}
              color={Colors.BodyText}
              style={{paddingTop: gGap(10)}}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: gGap(10),
            // backgroundColor: 'red',
            paddingLeft: gGap(5),
          }}>
          {selectedNote?.purpose?.category && (
            <View style={styles.noteTimeCon}>
              <FoundationIcon
                name={'target'}
                size={25}
                color={Colors.BodyText}
              />
              <Text style={styles.noteTimeText}>
                {selectedNote?.purpose?.category}
              </Text>
            </View>
          )}
          <View style={styles.noteTimeCon}>
            <AntDesignIcon
              name={'calendar'}
              size={18}
              color={Colors.BodyText}
            />
            <Text style={styles.noteTimeText}>
              {moment(
                selectedNote?.updatedAt || selectedNote?.createdAt,
              ).format('LLLL')}
            </Text>
          </View>
        </View>
        {selectedNote?.tags && selectedNote?.tags.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: gGap(5),
              paddingLeft: gGap(5),
              alignItems: 'center',
            }}>
            <FeatherIcon name="tag" size={20} color={Colors.BodyText} />
            <Text
              style={{
                fontFamily: CustomFonts.MEDIUM,
                color: Colors.Heading,
              }}>
              Tags:
            </Text>
            {selectedNote?.tags.map((tag, idx) => (
              <View
                style={{
                  backgroundColor: Colors.Heading + '30',
                  paddingHorizontal: gGap(10),
                  borderWidth: 1,
                  borderColor: Colors.Heading + '50',
                  borderRadius: 50,
                  paddingBottom: gGap(2),
                  marginVertical: gGap(2),
                }}
                key={idx}>
                <Text
                  style={{
                    fontFamily: CustomFonts.MEDIUM,
                    color: Colors.Heading,
                  }}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        )}
        <Divider2 marginTop={gGap(5)} marginBottom={gGap(5)} />
        {selectedNote?.thumbnail && (
          <View style={{height: 200, width: '100%'}}>
            <Image
              source={{uri: selectedNote?.thumbnail}}
              style={{
                height: '100%',
                width: '100%',
                resizeMode: 'cover',
                borderRadius: gGap(8),
              }}
            />
          </View>
        )}
        {selectedNote?.description && (
          <TextRender text={selectedNote?.description || ''} />
        )}
        {selectedNote?.x && selectedNote.y && (
          <NotesPopup
            onDeletePress={async () => {
              dispatch(selectNote({...selectedNote, x: null, y: null}));
              dispatch(selectNote(null));
              await handleDeleteNote(selectedNote);
              navigation.goBack();
            }}
            onNoteUpdatePress={() => {
              navigate('NoteCreateScreen');
            }}
          />
        )}
      </ScrollView>
      {selectedNote?.attachments && selectedNote?.attachments?.length > 0 && (
        <View style={styles.attachmentsContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontFamily: CustomFonts.SEMI_BOLD,
                color: Colors.Heading,
                fontSize: fontSizes.heading,
              }}>
              Note Attachments ({selectedNote.attachments.length})
            </Text>
            <FeatherIcon
              onPress={() => {
                setAttachmentVisible(!attachmentVisible);
              }}
              name={attachmentVisible ? 'chevron-down' : 'chevron-right'}
              size={30}
              color={Colors.Heading}
            />
          </View>

          {attachmentVisible && (
            <View style={{maxHeight: gGap(300)}}>
              <ScrollView>
                {selectedNote?.attachments.map((item, i) => (
                  <View style={styles.attachmentItem} key={i}>
                    <Text
                      style={[
                        styles.attachmentText,
                        {
                          fontWeight: 'bold',
                          fontSize: fontSizes.body,
                          color: Colors.Heading,
                          textTransform: 'capitalize',
                        },
                      ]}
                      numberOfLines={1}>
                      {item.name}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: gGap(10),
                      }}>
                      <Text style={styles.attachmentText} numberOfLines={1}>
                        <Text style={{fontWeight: 'bold'}}>Size:</Text>{' '}
                        {convertSize(item.size)}
                      </Text>
                      <Text style={styles.attachmentText} numberOfLines={1}>
                        <Text style={{fontWeight: 'bold'}}>File Type:</Text>{' '}
                        {item.type}
                      </Text>
                    </View>
                    <Text style={styles.attachmentText} numberOfLines={1}>
                      <Text style={{fontWeight: 'bold'}}>Uploaded At:</Text>{' '}
                      {moment(item.createdAt).format('LLL')}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity
                        onPress={() => {
                          item?.url && handleOpenLink(item.url || '');
                        }}
                        style={{
                          backgroundColor: Colors.Primary,
                          paddingHorizontal: gGap(10),
                          paddingVertical: gGap(3),
                          marginTop: gGap(2),
                          borderRadius: gGap(4),
                        }}>
                        <Text
                          style={{
                            color: Colors.PureWhite,
                            fontFamily: CustomFonts.MEDIUM,
                          }}>
                          Download
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default NoteDetails;
const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    noteTimeCon: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: gGap(10),
    },
    titleText: {
      fontSize: gFontSize(26),
      color: Colors.Heading,
      fontWeight: '700',
      marginBottom: gGap(5),
      width: '92%',
    },
    noteTimeText: {
      color: Colors.BodyText,
      //   textTransform: 'capitalize',
    },
    attachmentsContainer: {
      backgroundColor: Colors.Foreground,
      padding: gGap(10),
      marginBottom: gGap(10),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: borderRadius.small,
      gap: gGap(5),
      marginTop: gGap(5),
    },
    attachmentItem: {
      backgroundColor: Colors.Background_color,
      paddingVertical: gGap(5),
      paddingHorizontal: gGap(10),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: borderRadius.small,
      flex: 1,
    },
    attachmentText: {
      color: Colors.BodyText,
      maxWidth: '90%',
    },
  });
