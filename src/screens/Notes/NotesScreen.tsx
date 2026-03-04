import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import {INote, TColors} from '../../types';
import TextRender from '../../components/SharedComponent/TextRender';
import {RootState} from '../../types/redux/root';
import {useDispatch, useSelector} from 'react-redux';
import {ScrollView} from 'react-native';
import {loadMyNotes} from '../../actions/myNoteApiCall';
import moment from 'moment';
import {selectNote} from '../../store/reducer/notesReducer';
import {navigate} from '../../navigation/NavigationService';
import {truncateLexicalJSON} from '../../utility/lexicalUtils';
import {borderRadius, fontSizes, gGap} from '../../constants/Sizes';
import {AntDesignIcon, MaterialCommunityIcon} from '../../constants/Icons';
import {loadSingleChapterForNotes} from '../../actions/apiCall2';
import CustomFonts from '../../constants/CustomFonts';
import SearchIcon from '../../assets/Icons/SearchIcon';

const NotesScreen = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();
  const {notes} = useSelector((state: RootState) => state.notes);
  const [leftColumnNotes, setLeftColumnNotes] = useState<INote[]>([]);
  const [rightColumnNotes, setRightColumnNotes] = useState<INote[]>([]);
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    loadMyNotes({
      page: 1,
      limit: 50,
      sort: 'newest',
      query: 'math',
    });
    return () => {
      dispatch(selectNote(null));
    };
  }, [dispatch]);

  // Filter and distribute notes between columns when notes or searchText change
  useEffect(() => {
    const filteredNotes = searchText
      ? notes.filter(item =>
          item.title.toLowerCase().includes(searchText.toLowerCase()),
        )
      : notes;

    const left: INote[] = [];
    const right: INote[] = [];

    // Distribute filtered notes: odd indexes to left, even to right
    filteredNotes.forEach((note, index) => {
      if (index % 2 === 0) {
        left.push(note);
      } else {
        right.push(note);
      }
    });

    setLeftColumnNotes(left);
    setRightColumnNotes(right);
  }, [notes, searchText]);

  // Render a single note card
  const renderNoteCard = (note: INote) => {
    return (
      <Pressable
        onPress={() => {
          dispatch(selectNote(note));
          loadSingleChapterForNotes();
          navigate('NoteDetails');
        }}
        style={styles.noteCard}
        key={note._id}>
        <Text style={styles.noteTitle}>{note.title}</Text>
        <TextRender text={truncateLexicalJSON(note.description)} />
        {note.tags && note.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {note.tags.map((tag, index) => (
              <View key={index} style={styles.tagItem}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
        <Text style={styles.noteDate}>
          {moment(note.updatedAt).format('LLL')}
        </Text>
      </Pressable>
    );
  };

  if (
    (leftColumnNotes.length === 0 && rightColumnNotes.length === 0) ||
    notes.length === 0
  ) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.Background_color,
        }}>
        <View
          style={{
            backgroundColor: Colors.Foreground,
            justifyContent: 'center',
            paddingVertical: gGap(10),
            paddingHorizontal: gGap(50),
            borderWidth: 1,
            borderColor: Colors.BorderColor,
            borderRadius: borderRadius.default,
            width: '90%',
            marginTop: gGap(-100),
          }}>
          <View style={{alignItems: 'center'}}>
            <MaterialCommunityIcon
              name="notebook-check-outline"
              size={40}
              color={Colors.BodyText}
              style={{
                backgroundColor: Colors.Background_color,
                padding: 20,
                borderRadius: borderRadius.circle,
                borderWidth: 1,
                borderColor: Colors.BorderColor,
              }}
            />
          </View>
          <Text
            style={{
              color: Colors.Heading,
              fontSize: fontSizes.heading,
              fontWeight: '600',
              textAlign: 'center',
              marginTop: gGap(10),
            }}>
            No notes yet
          </Text>
          <Text
            style={{
              color: Colors.BodyText,
              fontSize: fontSizes.body,
              textAlign: 'center',
              marginTop: gGap(5),
            }}>
            Create your first note to get started. Your notes will appear here.
          </Text>
          <View style={{alignItems: 'center', marginVertical: gGap(20)}}>
            <TouchableOpacity
              onPress={() => {
                navigate('NoteCreateScreen');
              }}
              style={{
                backgroundColor: Colors.PrimaryButtonBackgroundColor,
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: gGap(5),
                paddingHorizontal: gGap(10),
                gap: gGap(10),
                borderWidth: 1,
                borderColor: Colors.BorderColor,
                borderRadius: borderRadius.small,
              }}>
              <AntDesignIcon
                name="plus"
                size={25}
                color={Colors.PrimaryButtonTextColor}
              />
              <Text
                style={{
                  color: Colors.PrimaryButtonTextColor,
                  fontSize: fontSizes.body,
                  textAlign: 'center',
                }}>
                Create your first note
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigate('NoteCreateScreen');
        }}
        style={styles.addButton}>
        <AntDesignIcon name="plus" size={25} color={Colors.PureWhite} />
      </TouchableOpacity>
      <SearchSection onChangeText={setSearchText} />
      <ScrollView
        refreshControl={
          <RefreshControl
            tintColor={Colors.BodyText}
            refreshing={false}
            onRefresh={() => {
              setSearchText(''); // Clear search on refresh
              loadMyNotes({
                page: 1,
                limit: 50,
                sort: 'newest',
                query: '',
              });
            }}
          />
        }
        contentContainerStyle={styles.scrollContainer}>
        <View style={styles.gridContainer}>
          {/* Left Column */}
          <View style={styles.column}>
            {leftColumnNotes.map(note => renderNoteCard(note))}
          </View>

          {/* Right Column */}
          <View style={styles.column}>
            {rightColumnNotes.map(note => renderNoteCard(note))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default NotesScreen;

const getStyles = (Colors: TColors) => {
  const {width} = Dimensions.get('window');
  const columnWidth = (width - 36) / 2;

  return StyleSheet.create({
    addButton: {
      position: 'absolute',
      bottom: gGap(15),
      right: gGap(15),
      backgroundColor: Colors.Primary,
      padding: gGap(5),
      borderRadius: 100,
      zIndex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
    },
    scrollContainer: {
      padding: 12,
    },
    gridContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
    },
    column: {
      width: columnWidth,
    },
    noteCard: {
      backgroundColor: Colors.Foreground,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    noteTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors.Heading,
      marginBottom: 8,
    },
    noteDescription: {
      fontSize: 14,
      color: Colors.BodyText,
      marginBottom: 8,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: gGap(3),
      marginVertical: gGap(5),
    },
    tagItem: {
      backgroundColor: Colors.SecondaryButtonBackgroundColor,
      borderRadius: borderRadius.small,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      paddingHorizontal: gGap(3),
    },
    tagText: {
      fontSize: 12,
      color: Colors.BodyText,
    },
    noteDate: {
      fontSize: 12,
      color: Colors.BodyText,
      textAlign: 'right',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.Foreground,
      borderRadius: borderRadius.default,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      paddingHorizontal: gGap(10),
      marginHorizontal: gGap(12),
    },
    searchInput: {
      flex: 1,
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: fontSizes.body,
      paddingVertical: gGap(10),
    },
    searchIcon: {
      marginLeft: gGap(5),
    },
  });
};

const SearchSection = ({
  onChangeText,
}: {
  onChangeText: (text: string) => void;
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <View style={styles.searchContainer}>
      <TextInput
        placeholder="Search notes..."
        onChangeText={onChangeText}
        placeholderTextColor={Colors.BodyText}
        keyboardAppearance="dark"
        style={styles.searchInput}
      />
      <View style={styles.searchIcon}>
        <SearchIcon />
      </View>
    </View>
  );
};
