import axios from 'axios';

export default getRestApi = async () => {
  return axios.create({
    baseURL: 'https://1f8c6c7f.ngrok.io/api',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};