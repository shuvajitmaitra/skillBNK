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
import React, {useEffect, useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import {TColors} from '../../types';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {borderRadius, fontSizes, gGap, gHeight} from '../../constants/Sizes';
import LexicalEditor from '../../components/SharedComponent/LexicalEditor';
import {
  AntDesignIcon,
  FeatherIcon,
  MaterialCommunityIcon,
} from '../../constants/Icons';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import CrossIcon from '../../assets/Icons/CrossIcon';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import {extractFileName, showToast} from '../../components/HelperFunction';
import {pick, types} from '@react-native-documents/picker';
import axiosInstance from '../../utility/axiosInstance';
import {
  Asset,
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import CrossCircle from '../../assets/Icons/CrossCircle';
import RequireFieldStar from '../../constants/RequireFieldStar';
import {
  convertSize,
  replaceSpaceWithDash,
  theme,
} from '../../utility/commonFunction';
import moment from 'moment';

interface DocumentAttachment {
  _id?: string;
  name: string;
  size: number;
  type: string;
  url: string;
  createdAt?: string;
}

type DocumentForm = {
  _id?: string;
  title: string;
  description: string;
  purpose?: {
    category?: string;
    resourceId?: string;
  };
  tags: string[];
  thumbnail: string;
  attachments: DocumentAttachment[];
};

interface SelectedDocument {
  _id?: string;
  name?: string;
  description?: string;
  purpose?: {
    category?: string;
    resourceId?: string;
  };
  tags?: string[];
  thumbnail?: string;
  attachments?: DocumentAttachment[];
}

type RootStackParamList = {
  AddNewDocumentsScreen: SelectedDocument | undefined;
};

interface UploadedFile {
  location: string;
  name: string;
  type?: string;
  size: number;
}

const EMPTY_DOCUMENT: DocumentForm = {
  title: '',
  description: '',
  purpose: {
    category: '',
    resourceId: '',
  },
  tags: [],
  thumbnail: '',
  attachments: [],
};

const EMPTY_EDITOR_STATE = JSON.stringify({
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
});

const handleDocumentUpload = async ({
  setState,
  setDocUploading,
}: {
  setState: React.Dispatch<React.SetStateAction<DocumentForm>>;
  setDocUploading?: (arg0: boolean) => void;
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

        const res = await axiosInstance.post('/chat/file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        return res.data.file;
      }),
    );

    const files: DocumentAttachment[] = uploadedFiles.map((file: any) => ({
      name: file.name || 'uploaded_file',
      size: file.size,
      type: file.type || 'application/octet-stream',
      url: file.location,
      createdAt: file.createdAt,
    }));

    setState(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  } catch (err: any) {
    console.log('Document picker error:', err);
    showToast({
      message: 'Failed to pick attachment',
      background: 'red',
    });
  } finally {
    setDocUploading?.(false);
  }
};

const handleGalleryPress = async ({
  setState,
  setIsLoading,
  selectLimit,
  mode,
}: {
  setState: React.Dispatch<React.SetStateAction<DocumentForm>>;
  setIsLoading?: (arg0: boolean) => void;
  selectLimit?: number;
  mode: 'thumbnail' | 'attachment';
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
      return;
    }

    if (response.errorCode) {
      showToast({message: `ImagePicker Error: ${response.errorMessage}`});
      return;
    }

    if (!response.assets || response.assets.length === 0) {
      showToast({message: 'No images selected'});
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

        const res = await axiosInstance.post('/chat/file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        return res.data.file;
      }),
    );

    const files: DocumentAttachment[] = uploadedFiles.map(file => ({
      url: file.location,
      name: file.name,
      type: file.type || 'image/jpeg',
      size: file.size,
    }));

    setState(prev => ({
      ...prev,
      thumbnail:
        mode === 'thumbnail' ? files[0]?.url || prev.thumbnail : prev.thumbnail,
      attachments:
        mode === 'attachment'
          ? [...prev.attachments, ...files]
          : prev.attachments,
    }));
  } catch (error) {
    console.error('Error in handleGalleryPress:', error);
    showToast({message: 'An error occurred while uploading images.'});
  } finally {
    setIsLoading?.(false);
  }
};

const handleCreateDocument = async (document: DocumentForm) => {
  if (!document.title.trim()) {
    return showToast({
      message: 'Document title is required!',
      background: 'red',
    });
  }

  try {
    const response = await axiosInstance.post('/document/userdocument/add', {
      description: document.description || EMPTY_EDITOR_STATE,
      name: document.title,
      tags: document.tags,
      thumbnail: document.thumbnail,
      attachments: document.attachments,
    });

    if (response.data.success) {
      showToast({message: 'Document created successfully!'});
    }
  } catch (error: any) {
    showToast({
      message: error?.response?.data?.error || 'Failed to create document',
      background: 'red',
    });
  }
};

const handleEditDocument = async (document: DocumentForm) => {
  if (!document.title.trim()) {
    return showToast({message: 'Title is required', background: 'red'});
  }
  try {
    const response = await axiosInstance.patch(
      `/document/userdocument/update/${document._id}`,
      {
        description: document.description || EMPTY_EDITOR_STATE,
        name: document.title,
        tags: document.tags,
        thumbnail: document.thumbnail,
        attachments: document.attachments,
      },
    );

    if (response.data.success) {
      showToast({message: 'Document updated successfully!'});
    }
  } catch (error: any) {
    showToast({
      message: error?.response?.data?.error || 'Failed to update document',
      background: 'red',
    });
  }
};

const AddNewDocumentsScreen = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {top, bottom} = useSafeAreaInsets();
  const navigation = useNavigation();
  const route =
    useRoute<RouteProp<RootStackParamList, 'AddNewDocumentsScreen'>>();

  const selectedDocument = route.params;

  const [tagText, setTagText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [docUploading, setDocUploading] = useState(false);
  const [document, setDocument] = useState<DocumentForm>(EMPTY_DOCUMENT);

  useEffect(() => {
    if (selectedDocument?._id) {
      setDocument({
        _id: selectedDocument._id,
        title: selectedDocument.name || '',
        description: selectedDocument.description || '',
        tags: selectedDocument.tags || [],
        thumbnail: selectedDocument.thumbnail || '',
        attachments: selectedDocument.attachments || [],
        purpose: selectedDocument.purpose || {
          category: '',
          resourceId: '',
        },
      });
    }
  }, [selectedDocument]);

  const [imageDimensions, setImageDimensions] = useState<{
    [key: string]: {aspectRatio: number};
  }>({});

  const handleImageLayout = (uri: string, width: number, height: number) => {
    const aspectRatio = width / height;
    setImageDimensions(prev => ({
      ...prev,
      [uri]: {aspectRatio},
    }));
  };

  const {aspectRatio} =
    (document.thumbnail && imageDimensions[document.thumbnail]) || {};

  const handleAddTag = () => {
    const value = tagText.trim();
    if (!value || document.tags.length >= 5) return;

    setDocument(prev => ({
      ...prev,
      tags: [...prev.tags, value],
    }));
    setTagText('');
  };

  const handleRemoveTag = (index: number) => {
    setDocument(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  return (
    <View style={[styles.container, {paddingTop: top, paddingBottom: bottom}]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidView}>
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
                {selectedDocument?._id ? 'Update Document' : 'Add Document'}
              </Text>
              {/* <Text style={styles.headerDescription}>
                {selectedDocument?._id
                  ? 'Fill out the form to update the document'
                  : 'Fill out the form to add a new document'}
              </Text> */}
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                if (!document.title.trim()) {
                  return showToast({
                    message: 'Title is required',
                    background: 'red',
                  });
                }

                if (document._id) {
                  handleEditDocument(document);
                } else {
                  handleCreateDocument(document);
                }

                navigation.goBack();
              }}>
              <Text style={styles.saveButtonText}>
                {selectedDocument?._id ? 'Update' : 'Save'}
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
              value={document.title}
              onChangeText={t =>
                setDocument(prev => ({
                  ...prev,
                  title: t,
                }))
              }
              placeholder="Enter document title"
              placeholderTextColor={Colors.BodyText}
            />

            <Text style={styles.label}>Description</Text>
            <LexicalEditor
              theme={theme()}
              data={{
                theme: 'dark',
                note: document.description || EMPTY_EDITOR_STATE,
              }}
              onChange={d => {
                if (d.type === 'NOTE_CHANGE') {
                  setDocument(prev => ({
                    ...prev,
                    description: d.payload.note,
                  }));
                }
              }}
              containerStyle={styles.lexicalEditor}
            />

            <Text style={[styles.label, styles.marginTop10]}>Tags</Text>

            {!!document.tags.length && (
              <View style={styles.tagsContainer}>
                {document.tags.map((item, index) => (
                  <TouchableOpacity
                    style={styles.tagItem}
                    onPress={() => handleRemoveTag(index)}
                    key={`${item}-${index}`}>
                    <Text style={styles.tagText}>{item}</Text>
                    <CrossIcon color="red" />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {document.tags.length < 5 && (
              <View style={styles.tagInputContainer}>
                <TextInput
                  style={[styles.input, styles.noMarginBottom]}
                  value={tagText}
                  onChangeText={setTagText}
                  placeholder="Enter tags (max 5)"
                  onSubmitEditing={handleAddTag}
                  editable={document.tags.length < 5}
                  placeholderTextColor={Colors.BodyText}
                />
                {!!tagText && (
                  <AntDesignIcon
                    onPress={handleAddTag}
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

            {document.thumbnail ? (
              <View style={styles.thumbnailContainer}>
                <Image
                  source={{uri: document.thumbnail}}
                  style={[
                    styles.image,
                    aspectRatio
                      ? {aspectRatio}
                      : {height: responsiveScreenHeight(20)},
                  ]}
                  onLoad={({nativeEvent}) =>
                    document.thumbnail &&
                    handleImageLayout(
                      document.thumbnail,
                      nativeEvent.source.width,
                      nativeEvent.source.height,
                    )
                  }
                />
                <TouchableOpacity
                  onPress={() =>
                    setDocument(prev => ({
                      ...prev,
                      thumbnail: '',
                    }))
                  }
                  style={styles.crossButton}>
                  <CrossCircle color="red" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() =>
                  handleGalleryPress({
                    setState: setDocument,
                    setIsLoading: setUploading,
                    selectLimit: 1,
                    mode: 'thumbnail',
                  })
                }
                style={styles.uploadThumbnailContainer}>
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
                    <Text style={styles.uploadSubText}>JPG, PNG | Max 5MB</Text>
                  </>
                )}
              </TouchableOpacity>
            )}

            <Text style={[styles.label, styles.marginTop10]}>
              Upload Attachments
            </Text>

            {!!document.attachments.length && (
              <View style={styles.attachmentsContainer}>
                {document.attachments.map((item, i) => (
                  <View style={styles.attachmentItem} key={`${item.url}-${i}`}>
                    <View style={{flex: 1}}>
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
                        numberOfLines={1}>
                        {extractFileName(item.name || '')}
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
                        {item.createdAt
                          ? moment(item.createdAt).format('LLL')
                          : 'N/A'}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        setDocument(prev => ({
                          ...prev,
                          attachments: prev.attachments.filter(
                            (_, idx) => idx !== i,
                          ),
                        }));
                      }}>
                      <CrossCircle color="red" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {document.attachments.length <= 10 && (
              <TouchableOpacity
                onPress={() =>
                  handleDocumentUpload({
                    setState: setDocument,
                    setDocUploading,
                  })
                }
                style={styles.uploadThumbnailContainer}>
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

export default AddNewDocumentsScreen;

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
      flex: 1,
    },
  });
