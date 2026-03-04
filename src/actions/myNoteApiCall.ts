import axios from 'axios';
import axiosInstance from '../utility/axiosInstance';
import store from '../store';
import {setNotes} from '../store/reducer/notesReducer';
import {INote} from '../types';
import {showToast} from '../components/HelperFunction';

// interface Note {
//   // Define note properties based on your Note object structure
//   id?: string;
//   title?: string;
//   content?: string;
//   createdAt?: string;
//   updatedAt?: string;
//   // Add other relevant fields
// }

// interface Pagination {
//   total: number;
//   currentPage: number;
//   totalPages: number;
//   hasNext: boolean;
//   hasPrev: boolean;
//   limit: number;
// }

interface GetNotesParams {
  page?: number;
  limit?: number;
  sort?: 'newest' | 'oldest' | 'updated-asc' | 'updated-desc';
  query?: string;
  action?: 'export';
}

export async function loadMyNotes(params: GetNotesParams) {
  const {page = 1, limit = 30, sort = 'newest', query, action} = params;

  try {
    const queryParams: Record<string, string> = {
      page: page.toString(),
      limit: Math.min(limit, 300).toString(),
      sort,
    };

    if (query) {
      queryParams.query = query;
    }

    if (action) {
      queryParams.action = action;
    }

    const response = await axiosInstance.get('/content/note/mynotes');
    store.dispatch(setNotes(response.data.notes));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 400) {
        throw new Error(error.response.data.error || 'Bad request');
      }
      throw new Error('Something went wrong');
    }
    throw error instanceof Error
      ? error
      : new Error('An unexpected error occurred');
  }
}

export const handleDeleteNote = async (note: INote) => {
  const preNotes = store
    .getState()
    .notes.notes.filter(item => item._id !== note._id);
  store.dispatch(setNotes(preNotes));

  try {
    const response: any = await axiosInstance.delete(
      `/content/note/delete/${note._id}`,
    );
    if (response.data.success) {
      showToast({
        message: 'Note deleted successfully...',
      });
      loadMyNotes({
        page: 1,
        limit: 50,
        sort: 'newest',
        query: '',
      });
    }
  } catch (error: any) {
    console.log(
      'error to delete notes',
      JSON.stringify(error.response.data.error, null, 2),
    );
    showToast({
      message: error.response.data.error || 'Cannot delete note',
    });
  }
};
