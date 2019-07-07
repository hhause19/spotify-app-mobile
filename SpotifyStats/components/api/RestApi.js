import axios from 'axios';

export default getRestApi = async () => {
  return axios.create({
    baseURL: 'http://362f8891.ngrok.io/api',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
