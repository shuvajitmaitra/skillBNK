import {TFile} from '../types/chat/messageTypes';

export const useExtractFiles = (files: TFile[]) => {
  const images: TFile[] = [];
  const audios: TFile[] = [];
  const documents: TFile[] = [];

  files.forEach((file: TFile) => {
    const fileType = file.type.toLowerCase();

    if (fileType.startsWith('image/')) {
      images.push(file);
    } else if (fileType.startsWith('audio/')) {
      audios.push(file);
    } else if (fileType === 'application/pdf') {
      documents.push(file);
    }
  });

  return {
    audios,
    images,
    documents,
  };
};
