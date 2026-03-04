import axios from 'axios';
import environment from '../constants/environment';
import {storage} from './mmkvInstance';
import {mStore} from './mmkvStoreName';

let apiUrl = environment.production
  ? 'https://api.skillbnk.com/api'
  : 'https://staging-api.skillbnk.com/api';

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

export const configureAxiosHeader = async () => {
  const value = storage?.getString(mStore.USER_TOKEN);
  if (value) {
    axiosInstance.defaults.headers.common = {
      Authorization: value,
    };
  }

  const enroll = storage?.getString('active_enrolment');
  if (enroll) {
    let enrollId = JSON.parse(enroll)?._id;
    if (enrollId) {
      axiosInstance.defaults.headers.common.enrollment = enrollId;
    }
  }

  const org = storage?.getString('organization');
  if (org) {
    let orgId = JSON.parse(org)?._id;
    if (orgId) {
      axiosInstance.defaults.headers.common.organization = orgId;
    }
  }
};

// Create cancel token using axios
export const getCancelTokenSource = () => axios.CancelToken.source();

export const isCancel = (error: any) => axios.isCancel(error);

export default axiosInstance;
