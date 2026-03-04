import {showToast} from '../components/HelperFunction';
import store from '../store';
import {
  setChapterData,
  setSelectedLesson,
} from '../store/reducer/programReducer';
import axiosInstance from '../utility/axiosInstance';
function capitalizeWord(word: string) {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
export const programService = {
  loadProgramModules: async (slug: string, categoryId: string) => {
    try {
      const response = await axiosInstance.get(
        `/course/chapterv2/mychapters/${slug}/${categoryId}`,
      );
      if (response.data.success) {
        store.dispatch(setChapterData(response.data.chapters));
      }
    } catch (error: any) {
      console.log(
        'error to load chapters',
        JSON.stringify(error.response.data.error, null, 2),
      );
    }
  },
  handleProgramItemAction: async (
    courseId: string,
    actionType: string,
    itemId: string,
  ) => {
    try {
      const response = await axiosInstance.post(
        `course/chapterv2/track/${courseId}`,
        {
          action: actionType,
          chapterId: itemId,
        },
      );
      console.log(
        'Program action status',
        JSON.stringify(response.data, null, 2),
      );
      if (response.data.success) {
        showToast({
          message: `${capitalizeWord(actionType)} action completed`,
        });
      }
    } catch (error: any) {
      console.log(
        'error to complete program action',
        JSON.stringify(error.response.data.error, null, 2),
      );
      showToast({
        message: error.response.data.error || 'Cannot complete action',
      });
    }
  },
  loadSingleLessonData: async (chapterId: string) => {
    try {
      const response = await axiosInstance.get(
        `/course/chapterv2/get-single/chapter/${chapterId}`,
      );
      if (response.data.success) {
        store.dispatch(setSelectedLesson(response.data.chapter));
      }
    } catch (error: any) {
      console.log(
        'error to load single chapter',
        JSON.stringify(error.response.data.error, null, 2),
      );
      showToast({
        message: error.response.data.error || 'Can not get lesson info',
      });
    }
  },
  saveLessonProgress: async ({
    lessonId,
    progress,
  }: {
    lessonId: string;
    progress: {
      action: string;
      chapterId: string;
      watched: number;
      total: number;
    };
  }) => {
    try {
      const response = await axiosInstance.post(
        `/course/chapterv2/track/${lessonId}`,
        progress,
      );
      if (response.data.success) {
        console.log(
          'Lesson progress saved',
          JSON.stringify(response.data, null, 2),
        );
      }
    } catch (error: any) {
      console.log(
        'error to save lesson progress',
        JSON.stringify(error.response.data.error, null, 2),
      );
    }
  },
};
