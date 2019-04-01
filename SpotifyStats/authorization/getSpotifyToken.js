import { encode as btoa } from 'base-64';
import getRestApi from '../components/api/RestApi';
import {getAuthorizationCode} from './getSpotifyAuthorization';

export default getTokens = async () => {
  try {
    const {credentials, authorizationCode} = await getAuthorizationCode();//we wrote this function above

    const credsB64 = btoa(`${credentials.clientId}:${credentials.clientSecret}`);
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credsB64}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${
        credentials.redirectUri
      }`,
    });
    const responseJson = await response.json();
    const api = await getRestApi();
    api.post('save_spotify_token', {access_token: responseJson.access_token});
    // destructure the response and rename the properties to be in camelCase to satisfy my linter ;)
    // const {
    //   access_token: accessToken,
    //   refresh_token: refreshToken,
    //   expires_in: expiresIn,
    // } = responseJson;

    //const expirationTime = new Date().getTime() + expiresIn * 1000;
    // await setUserData('accessToken', accessToken);
    // await setUserData('refreshToken', refreshToken);
    // await setUserData('expirationTime', expirationTime);
    //console.log(responseJson.access_token);
    //AsyncStorage.setItem('@MySuperStore:key', 'I like to save it.');
    //AsyncStorage.setItem('@MySuperStore:key', 'I like to save it.');
    return responseJson.access_token;
  } catch (err) {
    console.error(err);
  }
};