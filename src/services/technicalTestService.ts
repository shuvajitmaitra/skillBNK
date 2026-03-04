// technicalTestService.js
import {showToast} from '../components/HelperFunction';
import store from '../store';
import {
  setTechnicalTest,
  setTotalTestCount,
  setLoading,
  setTestStats,
} from '../store/reducer/TechnicalTestReducer';
import axiosInstance from '../utility/axiosInstance';

export const technicalTestService = {
  loadTechnicalTest: async (data: any = {}) => {
    try {
      // Set loading state for initial load or when explicitly set
      if (data.isInitialLoad) {
        store.dispatch(setLoading(true));
      }

      const response = await axiosInstance.get('/assignment/myassignments', {
        params: {
          page: data.page || 1,
          limit: data.limit || 5,
          sort: data.sort || null,
          category: data.category || 'question',
          query: data.query || null,
          type: data.type || null,
          status: data.status || null,
        },
      });

      if (response.data.success) {
        store.dispatch(
          setTechnicalTest({
            assignments: response.data.assignments || [],
            data: {
              page: data.page || 1,
            },
          }),
        );
        store.dispatch(setTestStats(response.data.stats));

        // Update total count
        store.dispatch(setTotalTestCount(response.data.count || 0));

        return {
          success: true,
          data: response.data,
          hasMore:
            response.data.assignments &&
            response.data.assignments.length > 0 &&
            response.data.assignments.length * data.page < response.data.count,
        };
      }

      return {success: false};
    } catch (error: any) {
      showToast({message: error.response.data.error, background: 'red'});
      console.log(
        'Error loading technical tests:',
        error.response
          ? JSON.stringify(error.response.data.error, null, 2)
          : error.message,
      );
      return {
        success: false,
        error: error.response ? error.response.data.error : error.message,
      };
    } finally {
      if (data.isInitialLoad) {
        store.dispatch(setLoading(false));
      }
    }
  },
};
