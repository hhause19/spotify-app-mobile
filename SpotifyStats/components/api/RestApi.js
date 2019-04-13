import axios from 'axios';

export default getRestApi = async () => {
  return axios.create({
    baseURL: 'https://98c257a3.ngrok.io/api',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};