import axios from 'axios';

export default getRestApi = async () => {
  return axios.create({
    baseURL: 'https://98f59057.ngrok.io/api',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};