import axios from 'axios';

export default getRestApi = async () => {
  return axios.create({
    baseURL: 'https://f7786847.ngrok.io/api',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
