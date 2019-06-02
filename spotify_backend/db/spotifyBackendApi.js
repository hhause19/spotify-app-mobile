const SpotifyWebApi = require('../spotify-web-api-node');
const fs = require('fs');
require('dotenv').config();

/**
 * @const spotifyApi - inits a spotify-web-api-node class with credentials.
 * @type {SpotifyWebApi}
 */
const spotifyApi = new SpotifyWebApi({
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  accessToken: fs.readFileSync('./spotify_auth/accessToken.txt', 'utf8'),
  refreshToken: fs.readFileSync('./spotify_auth/refreshToken.txt', 'utf8')
});

module.exports = spotifyApi;