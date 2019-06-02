require('dotenv').config();
const http = require('http');
const express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
const fs = require("fs");
var winston = require('winston'),
  expressWinston = require('express-winston');


// Initialize http server
const app = express();

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: false,
  msg: "HTTP {{req.method}} {{req.url}}",
  colorize: true,
}));

app.use(bodyParser.json()); //   support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
app.use(cors());

//controllers
let {PlaylistController} = require('./controllers/playlistController');
const playlistCtrl = new PlaylistController();

// Handle / route
app.get('/', (req, res) =>
  res.send('Hello World!')
);

///////////////// SPOTIFY AUTH ////////////////////////////

app.get('/api/spotify-credentials', (req, res, next) => {
  console.log('get creds');

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  const spotifyCredentials = {clientId, clientSecret, redirectUri};

  res.json(spotifyCredentials);
});

app.get('/api/spotify_token', (req, res, next) => {
  console.log('get token');

  const access_token = fs.readFileSync('./spotify_auth/accessToken.txt', 'utf8');
  const refresh_token = fs.readFileSync('./spotify_auth/refreshToken.txt', 'utf8');
  const expiration_time = fs.readFileSync('./spotify_auth/expirationTime.txt', 'utf8');

  res.json({access_token, refresh_token, expiration_time});
});

app.post('/api/save_spotify_tokens', (req, res, next) => {
  console.log('save token');

  let access_token = req.body.access_token;
  let refresh_token = req.body.refresh_token;
  let expiration_time = req.body.expiration_time;

  fs.writeFile('./spotify_auth/accessToken.txt', access_token, (err) => {
    if (err) throw err;
  });
  fs.writeFile('./spotify_auth/refreshToken.txt', refresh_token, (err) => {
    if (err) throw err;
  });
  fs.writeFile('./spotify_auth/expirationTime.txt', expiration_time, (err) => {
    if (err) throw err;
  });
});

////////////////// PLAYLISTS ///////////////////////////////

//TODO: set the interval to the expirey time and update token
handleAccessToken = () => {
};

// periodically update playlists
setInterval(() => {
  const currentdate = new Date();
  const datetime = "Playlist Update: " + currentdate.getDate() + "/"
    + (currentdate.getMonth() + 1) + "/"
    + currentdate.getFullYear() + " @ "
    + currentdate.getHours() + ":"
    + currentdate.getMinutes() + ":"
    + currentdate.getSeconds();

  console.log(datetime);
  playlistCtrl.updateSpotifyPlaylists();
  // 5 mins - 300000
  // 30 minutes - 1800000
}, 3000);

// gets users playlists
app.get('/api/playlists', (req, res, next) => {
  playlistCtrl.getPlaylists(req, res);
});

// inserts a newly created playlist into the db.
app.post('/api/playlists', (req, res, next) => {
  playlistCtrl.insertPlaylist(req, res);
});

// Launch the server on port 3000
const server = app.listen(3000, 'localhost', () => {
  const {address, port} = server.address();
  handleAccessToken();
  console.log(`Listening at http://${address}:${port}`);
});
