import axios from 'axios';

export default getRestApi = async () => {
  return axios.create({
    baseURL: 'https://4cdc2e30.ngrok.io/api',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};