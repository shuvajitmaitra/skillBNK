import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { TColors } from '../../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, fontSizes, gGap, gHeight } from '../../constants/Sizes';
import LexicalEditor from '../../components/SharedComponent/LexicalEditor';
import {
  AntDesignIcon,
  FeatherIcon,
  MaterialCommunityIcon,
} from '../../constants/Icons';
import { useNavigation } from '@react-navigation/native';
import EventPurposeV2 from '../../components/CalendarV2/EventPurposeV2';
import CrossIcon from '../../assets/Icons/CrossIcon';
import { responsiveScreenHeight } from 'react-native-responsive-dimensions';
import { extractFileName, showToast } from '../../components/HelperFunction';
import { pick, types } from '@react-native-documents/picker';
import axiosInstance from '../../utility/axiosInstance';
import {
  Asset,
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import CrossCircle from '../../assets/Icons/CrossCircle';
import { loadMyNotes } from '../../actions/myNoteApiCall';
import store from '../../store';
import { selectNote, setNotes } from '../../store/reducer/notesReducer';
import { useSelector } from 'react-redux';
import { RootState } from '../../types/redux/root';
import RequireFieldStar from '../../constants/RequireFieldStar';
import {
  convertSize,
  replaceSpaceWithDash,
  theme,
} from '../../utility/commonFunction';
import moment from 'moment';

type noteProps = {
  _id?: string;
  title?: string;
  description?: string;
  purpose?: {
    category?: string;
    resourceId?: string;
  };
  tags?: string[];
  thumbnail?: string;
  attachments?: {
    name: string;
    size: number;
    type: string;
    url: string;
    createdAt: string;
  }[];
};

interface UploadedFile {
  location: string;
  name: string;
  type?: string;
  size: number;
}

const handleDocumentUpload = async ({
  setState,
  setDocUploading,
}: {
  setState: (arg0: any) => void;
  setDocUploading?: (arg0: boolean) => void;
  selectLimit?: number;
}) => {
  setDocUploading?.(true);
  try {
    const result = await pick({
      type: [types.allFiles],
      allowMultiSelection: false,
    });

    const uploadedFiles = await Promise.all(
      result.map(async item => {
        const formData = new FormData();
        formData.append('file', {
          uri: item.uri,
          name: replaceSpaceWithDash(item.name || '') || 'uploaded_document',
          type: item.type || 'application/pdf',
        } as any);

        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };

        const res = await axiosInstance.post('/chat/file', formData, config);
        return res.data.file;
      }),
    );
    setDocUploading?.(false);
    const files = uploadedFiles.map((file: any) => ({
      name: file.name || 'uploaded_file',
      size: file.size,
      type: file.type,
      url: file.location,
    }));
    setState(files);
  } catch (err: any) {
    if (err) {
      console.log('User canceled the picker');
      setDocUploading?.(false);
    } else {
      console.error(err);
      showToast({
        message: 'Failed to pick attachment',
        background: 'red',
      });
    }
  }
};

const handleGalleryPress = async ({
  setState,
  setIsLoading,
  selectLimit,
}: {
  setState: (arg0: any) => void;
  setIsLoading?: (arg0: boolean) => void;
  selectLimit?: number;
}): Promise<void> => {
  const options: ImageLibraryOptions = {
    mediaType: 'photo',
    maxWidth: 1000,
    maxHeight: 1000,
    quality: 0.5,
    selectionLimit: selectLimit || 10,
  };

  try {
    setIsLoading?.(true);
    const response = await launchImageLibrary(options);

    if (response.didCancel) {
      console.log('User cancelled image picker');
      return;
    }

    if (response.errorCode) {
      console.error('ImagePicker Error: ', response.errorMessage);
      showToast({ message: `ImagePicker Error: ${response.errorMessage}` });
      return;
    }

    if (!response.assets || response.assets.length === 0) {
      console.log('No images selected');
      showToast({ message: 'No images selected' });
      return;
    }

    const uploadedFiles: UploadedFile[] = await Promise.all(
      response.assets.map(async (item: Asset): Promise<UploadedFile> => {
        const formData = new FormData();
        formData.append('file', {
          uri: item.uri,
          name:
            replaceSpaceWithDash(item.fileName || '') ||
            `uploaded_image_${Date.now()}`,
          type: item.type || 'image/jpeg',
        } as any);

        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };

        try {
          const res = await axiosInstance.post('/chat/file', formData, config);
          return res.data.file;
        } catch (uploadError) {
          console.error('Upload Error:', uploadError);
          throw uploadError;
        }
      }),
    );
    setState(
      uploadedFiles.map(file => ({
        url: file.location,
        name: file.name,
        type: file.type || 'image/jpeg',
        size: file.size,
      })),
    );
  } catch (error) {
    console.error('Error in handleGalleryPress:', error);
    showToast({ message: 'An error occurred while uploading images.' });
  } finally {
    setIsLoading?.(false);
  }
};

const handleCreateNote = async (note: noteProps) => {
  if (!note.title?.trim()) {
    return showToast({ message: 'Note title is required!', background: 'red' });
  }
  const preNotes = [
    { _id: Math.random.toString(), ...note },
    ...store.getState().notes.notes,
  ];
  store.dispatch(setNotes(preNotes));
  try {
    const response = await axiosInstance.post('/content/note/create', {
      description:
        note.description ||
        // eslint-disable-next-line quotes, no-useless-escape
        `{\"root\":{\"children\":[{\"children\":[],\"direction\":null,\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1,\"textFormat\":0,\"textStyle\":\"\"}],\"direction\":null,\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}`,
      title: note.title || 'Failed',
      tags: note.tags || [],
      thumbnail: note.thumbnail || '',
      attachments: note?.attachments || [],
      purpose: note.purpose || {
        category: '',
        resourceId: '',
      },
    });

    console.log(
      'response.data',
      JSON.stringify(response.data.success, null, 2),
    );
    if (response.data.success) {
      showToast({ message: 'Notes created successfully!' });
      loadMyNotes({
        page: 1,
        limit: 50,
        sort: 'newest',
        query: '',
      });
    }
  } catch (error: any) {
    console.log(
      'error to create note',
      JSON.stringify(error.response.data.error, null, 2),
    );
    showToast({
      message: error.response.data.error || 'Failed to create note',
    });
  }
};

const handleEditNote = async (note: noteProps) => {
  if (!note.title?.trim()) {
    return showToast({ message: 'Title is required', background: 'red' });
  }
  let preNotes = { ...note, ...store.getState().notes.selectedNote };
  store.dispatch(selectNote(preNotes));

  try {
    const response = await axiosInstance.patch(
      `/content/note/edit/${note?._id}`,
      {
        description:
          note.description ||
          // eslint-disable-next-line quotes, no-useless-escape
          `{\"root\":{\"children\":[{\"children\":[],\"direction\":null,\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1,\"textFormat\":0,\"textStyle\":\"\"}],\"direction\":null,\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}`,
        title: note.title || 'Failed',
        tags: note.tags || [],
        thumbnail: note.thumbnail || '',
        attachments: note?.attachments || [],
        purpose: note.purpose || {
          category: '',
          resourceId: '',
        },
      },
    );

    console.log(
      'response.data',
      JSON.stringify(response.data.success, null, 2),
    );
    if (response.data.success) {
      store.dispatch(selectNote(response.data.note));
      showToast({ message: 'Notes update successfully!' });
      loadMyNotes({
        page: 1,
        limit: 50,
        sort: 'newest',
        query: '',
      });
    }
  } catch (error: any) {
    console.log(
      'error to update note',
      JSON.stringify(error.response.data, null, 2),
    );
    showToast({
      message: error.response.data.error || 'Failed to update note',
    });
  }
};

const NoteCreateScreen = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const { top, bottom } = useSafeAreaInsets();
  const [tagText, setTagText] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [docUploading, setDocUploading] = useState(false);
  const { selectedNote } = useSelector((state: RootState) => state.notes);
  const navigation = useNavigation();
  const [note, setNote] = useState<noteProps | null>(null);
  useEffect(() => {
    if (selectedNote?._id) {
      const pre = { ...note };
      setNote({
        ...pre,
        _id: selectedNote?._id,
        title: selectedNote?.title,
        description: selectedNote?.description,
        tags: selectedNote?.tags,
        thumbnail: selectedNote?.thumbnail,
        attachments: selectedNote?.attachments,
        purpose: selectedNote?.purpose,
      });
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNote]);

  const [imageDimensions, setImageDimensions] = useState<{
    [key: string]: { aspectRatio: number };
  }>({});
  const handleImageLayout = (uri: string, width: number, height: number) => {
    const aspectRatio = width / height;
    setImageDimensions(prev => ({
      ...prev,
      [uri]: { aspectRatio },
    }));
  };
  const { aspectRatio } =
    (note?.thumbnail && imageDimensions[note.thumbnail]) || {};

  const handleKeyPress = () => {
    if (!tagText) return;
    const preT = note?.tags ? [...note?.tags] : [];
    const currT = [...preT, tagText];
    setNote({
      ...note,
      tags: currT,
    });
    setTagText('');
  };

  const handleRemoveTag = (index: number) => {
    const f = note?.tags!.filter((_, i) => i !== index);
    setNote({ ...note, tags: f });
  };

  return (
    <View
      style={[styles.container, { paddingTop: top, paddingBottom: bottom }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.headerContainer}>
          <AntDesignIcon
            onPress={() => navigation.goBack()}
            style={styles.backIcon}
            name="arrowleft"
            size={25}
            color={Colors.BodyText}
          />
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>
                {selectedNote?._id ? 'Update note' : 'Add note'}
              </Text>
              <Text style={styles.headerDescription}>
                {selectedNote?._id
                  ? 'Fill out the form, to update the note'
                  : 'Fill out the form, to add new note'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                if (!note?.title?.trim())
                  return showToast({
                    message: 'Title is required',
                    background: 'red',
                  });
                if (note._id) {
                  handleEditNote(note);
                } else if (note.title) {
                  note?.title && handleCreateNote(note);
                }
                navigation?.goBack();
              }}
            >
              <Text style={styles.saveButtonText}>
                {selectedNote?._id ? 'Update' : 'Save Note'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.contentContainer}>
            <Text style={styles.label}>
              Title
              <RequireFieldStar />
            </Text>
            <TextInput
              style={styles.input}
              value={note?.title}
              onChangeText={t => setNote({ ...note, title: t })}
              placeholder="Enter note title"
              placeholderTextColor={Colors.BodyText}
            />
            <Text style={styles.label}>Description</Text>
            <LexicalEditor
              theme={theme()}
              data={{
                theme: 'dark',
                note: selectedNote?.description
                  ? selectedNote.description
                  : JSON.stringify({
                      root: {
                        children: [
                          {
                            children: [
                              {
                                detail: 0,
                                format: 0,
                                mode: 'normal',
                                style: '',
                                text: ' ',
                                type: 'text',
                                version: 1,
                              },
                            ],
                            direction: 'ltr',
                            format: '',
                            indent: 0,
                            type: 'paragraph',
                            version: 1,
                            textFormat: 0,
                            textStyle: '',
                          },
                        ],
                        direction: 'ltr',
                        format: '',
                        indent: 0,
                        type: 'root',
                        version: 1,
                      },
                    }),
              }}
              onChange={d => {
                if (d.type === 'NOTE_CHANGE') {
                  setNote({ ...note, description: d.payload.note });
                }
              }}
              containerStyle={styles.lexicalEditor}
            />
            <EventPurposeV2
              state={note?.purpose as any}
              setState={i => setNote({ ...note, purpose: i })}
            />
            <Text style={[styles.label, styles.marginTop10]}>Tags</Text>
            {note?.tags && (
              <View style={styles.tagsContainer}>
                {note?.tags?.map((item, index) => (
                  <TouchableOpacity
                    style={styles.tagItem}
                    onPress={() => handleRemoveTag(index)}
                    key={index}
                  >
                    <Text style={styles.tagText}>{item}</Text>
                    <CrossIcon color="red" />
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {(!note?.tags || note?.tags?.length! < 5) && (
              <View style={styles.tagInputContainer}>
                <TextInput
                  style={[styles.input, styles.noMarginBottom]}
                  value={tagText ? tagText : undefined}
                  onChangeText={t => setTagText(t)}
                  placeholder="Enter tags (max 5)"
                  onSubmitEditing={handleKeyPress}
                  editable={note?.tags?.length! >= 5 ? false : true}
                  placeholderTextColor={Colors.BodyText}
                />
                {tagText && (
                  <AntDesignIcon
                    onPress={() => {
                      const preT = note?.tags ? [...note?.tags] : [];
                      const currT = [...preT, tagText];
                      setNote({
                        ...note,
                        tags: currT,
                      });
                      setTagText('');
                    }}
                    style={styles.checkIcon}
                    name="check"
                    size={25}
                    color={Colors.Primary}
                  />
                )}
              </View>
            )}
            <Text style={[styles.label, styles.marginTop10]}>
              Upload Thumbnail
            </Text>
            {note?.thumbnail ? (
              <View style={styles.thumbnailContainer}>
                <Image
                  source={{ uri: note.thumbnail }}
                  style={[
                    styles.image,
                    aspectRatio
                      ? { aspectRatio }
                      : { height: responsiveScreenHeight(20) },
                  ]}
                  onLoad={({ nativeEvent }) =>
                    note?.thumbnail &&
                    handleImageLayout(
                      note?.thumbnail,
                      nativeEvent.source.width,
                      nativeEvent.source.height,
                    )
                  }
                />
                <TouchableOpacity
                  onPress={() => setNote({ ...note, thumbnail: '' })}
                  style={styles.crossButton}
                >
                  <CrossCircle color="red" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() =>
                  handleGalleryPress({
                    setState: (i: any) =>
                      setNote({ ...note, thumbnail: i[0].url }),
                    setIsLoading: setUploading,
                    selectLimit: 1,
                  })
                }
                style={styles.uploadThumbnailContainer}
              >
                {uploading ? (
                  <ActivityIndicator size={30} color={Colors.Primary} />
                ) : (
                  <>
                    <FeatherIcon
                      name="image"
                      size={40}
                      color={Colors.Primary}
                    />
                    <Text style={styles.uploadText}>Click to upload image</Text>
                    <Text style={styles.uploadSubText}>JPG,PNG | Max 5MB</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
            <Text style={[styles.label, styles.marginTop10]}>
              Upload attachments
            </Text>
            {note?.attachments && note?.attachments?.length > 0 && (
              <View style={styles.attachmentsContainer}>
                {note?.attachments.map((item, i) => (
                  <View style={styles.attachmentItem} key={i}>
                    <View>
                      <Text
                        style={[
                          styles.attachmentText,
                          {
                            fontWeight: 'bold',
                            fontSize: fontSizes.subHeading,
                            color: Colors.Heading,
                            textTransform: 'capitalize',
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {extractFileName(item.name || '')}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: gGap(10),
                        }}
                      >
                        <Text style={styles.attachmentText} numberOfLines={1}>
                          <Text style={{ fontWeight: 'bold' }}>Size:</Text>{' '}
                          {convertSize(item.size)}
                        </Text>
                        <Text style={styles.attachmentText} numberOfLines={1}>
                          <Text style={{ fontWeight: 'bold' }}>File Type:</Text>{' '}
                          {item.type}
                        </Text>
                      </View>
                      <Text style={styles.attachmentText} numberOfLines={1}>
                        <Text style={{ fontWeight: 'bold' }}>Uploaded At:</Text>{' '}
                        {moment(item.createdAt).format('LLL')}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        const pre =
                          note.attachments &&
                          note.attachments.filter((_, idx) => idx !== i);
                        setNote({ ...note, attachments: pre });
                      }}
                    >
                      <CrossCircle color="red" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            {(!note?.attachments || note?.attachments?.length! <= 10) && (
              <TouchableOpacity
                onPress={() =>
                  handleDocumentUpload({
                    setState: (i: any) =>
                      setNote({
                        ...note,
                        attachments: [...(note?.attachments || []), ...i],
                      }),
                    setDocUploading: t => setDocUploading(t),
                  })
                }
                style={styles.uploadThumbnailContainer}
              >
                {docUploading ? (
                  <ActivityIndicator size={30} color={Colors.Primary} />
                ) : (
                  <>
                    <MaterialCommunityIcon
                      name="attachment"
                      size={40}
                      color={Colors.Primary}
                    />
                    <Text style={styles.uploadText}>
                      Click to upload attachments
                    </Text>
                    <Text style={styles.uploadSubText}>
                      JPG, PNG, PDF, DOCS | Max 5MB
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default NoteCreateScreen;

const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors.Background_color,
      flex: 1,
    },
    keyboardAvoidView: {
      flex: 1,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backIcon: {
      padding: gGap(5),
      paddingHorizontal: gGap(10),
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flex: 1,
      paddingRight: gGap(10),
    },
    headerTitle: {
      fontSize: fontSizes.heading,
      fontWeight: '700',
      color: Colors.Heading,
    },
    headerDescription: {
      fontSize: fontSizes.body,
      fontWeight: '400',
      color: Colors.BodyText,
    },
    saveButton: {
      backgroundColor: Colors.Primary,
      borderRadius: borderRadius.small,
      alignItems: 'center',
      height: gHeight(30),
      paddingHorizontal: gGap(10),
      justifyContent: 'center',
    },
    saveButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    scrollContainer: {
      flexGrow: 1,
      padding: gGap(10),
    },
    contentContainer: {
      flex: 1,
    },
    label: {
      fontSize: fontSizes.body,
      fontWeight: 'bold',
      marginBottom: 8,
      color: Colors.Heading,
    },
    input: {
      backgroundColor: Colors.Foreground,
      borderRadius: 6,
      padding: 12,
      marginBottom: 16,
      color: Colors.BodyText,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    lexicalEditor: {
      marginBottom: gGap(10),
      height: responsiveScreenHeight(50),
    },
    marginTop10: {
      marginTop: gGap(10),
    },
    tagsContainer: {
      flexDirection: 'row',
      gap: gGap(5),
      marginBottom: gGap(10),
      flexWrap: 'wrap',
    },
    tagItem: {
      flexDirection: 'row',
      backgroundColor: Colors.Foreground,
      alignItems: 'center',
      gap: gGap(5),
      paddingHorizontal: gGap(5),
      paddingVertical: gGap(3),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: borderRadius.small,
    },
    tagText: {
      color: Colors.BodyText,
    },
    tagInputContainer: {
      justifyContent: 'center',
    },
    noMarginBottom: {
      marginBottom: 0,
    },
    checkIcon: {
      position: 'absolute',
      right: gGap(10),
    },
    uploadThumbnailContainer: {
      backgroundColor: Colors.PrimaryOpacityColor,
      alignItems: 'center',
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: borderRadius.small,
      minHeight: gHeight(150),
      justifyContent: 'center',
    },
    uploadText: {
      color: Colors.Primary,
      fontSize: fontSizes.body,
      fontWeight: '700',
      paddingVertical: gGap(5),
    },
    uploadSubText: {
      color: Colors.BodyText,
      fontSize: fontSizes.small,
    },
    thumbnailContainer: {
      width: '50%',
    },
    image: {
      width: '100%',
      resizeMode: 'contain',
      borderRadius: borderRadius.small,
      backgroundColor: Colors.Background_color,
    },
    crossButton: {
      position: 'absolute',
      right: gGap(-15),
      top: gGap(-15),
    },
    attachmentsContainer: {
      backgroundColor: Colors.Foreground,
      padding: gGap(10),
      marginBottom: gGap(10),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: borderRadius.small,
      gap: gGap(5),
    },
    attachmentItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: Colors.Background_color,
      paddingVertical: gGap(5),
      paddingHorizontal: gGap(10),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: borderRadius.small,
    },
    attachmentText: {
      color: Colors.BodyText,
      maxWidth: '90%',
    },
  });
