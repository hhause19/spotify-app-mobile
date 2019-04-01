import {AsyncStorage} from 'react-native';
import axios from 'axios';

export default getSpotifyApi = async () => {
  let access_token =  await AsyncStorage.getItem('access_token');
  return axios.create({
    baseURL: 'https://api.spotify.com/v1',
    headers: {
      'Authorization': 'Bearer ' + access_token
    }
  });
};
