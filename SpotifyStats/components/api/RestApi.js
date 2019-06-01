import axios from 'axios';

export default getRestApi = async () => {
  return axios.create({
    baseURL: 'https://a7058ae4.ngrok.io/api',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};