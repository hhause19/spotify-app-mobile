import axios from 'axios';

export default getRestApi = async () => {
  return axios.create({
    baseURL: 'https://81251589.ngrok.io/api',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};