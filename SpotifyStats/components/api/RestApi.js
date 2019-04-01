import {AsyncStorage} from 'react-native';
import axios from 'axios';

export default getRestApi = async () => {
  return axios.create({
    baseURL: 'http://127.0.0.1:3000/api',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};