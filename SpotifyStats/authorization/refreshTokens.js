import getRestApi from "../components/api/RestApi";
import { encode as btoa } from 'base-64';

const getSpotifyCredentials = async () => {
  const api = await getRestApi();
  const res = await api.get('spotify-credentials');
  return res.data
};

export default refreshTokens = async (refresh_token) => {
  try {
    const credentials = await getSpotifyCredentials() //we wrote this function above
    const credsB64 = btoa(`${credentials.clientId}:${credentials.clientSecret}`);
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credsB64}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=refresh_token&refresh_token=${refresh_token}`,
    });
    const responseJson = await response.json();
    const api = await getRestApi();

    const {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
      expires_in: expiresIn,
    } = responseJson;

    const expirationTime = new Date().getTime() + expiresIn * 1000;

    // save the new tokens
    const data = {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
      expiration_time: expirationTime
    };
    console.log('REFRESH', data);
    api.post('save_spotify_tokens', data);

    return newAccessToken;
    //await setUserData('expirationTime', expirationTime);
  } catch (err) {
    console.error(err)
  }
};