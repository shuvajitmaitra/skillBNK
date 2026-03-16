import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import axiosInstance from '../../../utility/axiosInstance';
import {DocumentItem, DocumentsResponse, TColors} from '../../../types';
import DocumentCard from './MyDocumentsCard';
import CustomFonts from '../../../constants/CustomFonts';
import {useTheme} from '../../../context/ThemeContext';

const RelatedDocumentsSection = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [loading, setLoading] = useState(true);
  const fetchPage = useCallback(async () => {
    try {
      const res = await axiosInstance.get<DocumentsResponse>(
        '/document/mydocuments',
      );

      if (res.data.success) {
        setDocuments(res.data.documents);
      }
    } catch (error) {
      console.log('fetchPage error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPage();
    return () => {
      setDocuments(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = ({item}: {item: DocumentItem}) => {
    return <DocumentCard item={item} />;
  };
  const listEmptyCom = () => {
    return loading ? <ActivityIndicator /> : <></>;
  };

  return (
    <View>
      <Text style={styles.title}>Related Documents</Text>
      <FlatList
        data={documents}
        horizontal
        renderItem={renderItem}
        contentContainerStyle={{gap: 10, marginTop: 5}}
        ListEmptyComponent={listEmptyCom}
      />
    </View>
  );
};

export default RelatedDocumentsSection;
const getStyles = (Colors: TColors) =>
  StyleSheet.create({
    title: {
      fontSize: 22,
      fontFamily: CustomFonts.BOLD,
      color: Colors.Heading,
      marginTop: 10,
    },
  });
