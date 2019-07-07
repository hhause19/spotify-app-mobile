import axios from 'axios';

export default getRestApi = async () => {
  return axios.create({
    baseURL: 'https://836d68ac.ngrok.io/api',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
