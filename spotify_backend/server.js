require('dotenv').config();
const http = require('http');
const express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
const fs = require("fs");

// Initialize http server
const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors());

//controllers
let {PlaylistController} = require('./controllers/playlistController');
PlaylistController = new PlaylistController();

// Handle / route
app.get('/', (req, res) =>
    res.send('Hello World!')
);

///////////////// SPOTIFY AUTH ////////////////////////////

app.get('/api/spotify-credentials', (req, res, next) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  const spotifyCredentials = { clientId, clientSecret, redirectUri };
  console.log('get creds.');
  res.json(spotifyCredentials);
});

app.get('/api/spotify_token', (req, res, next) => {
  fs.readFile('./spotify_auth/spotifyToken.txt', 'utf8', function (err, access_token) {
    res.json({access_token});
  });
  console.log('get token');
});

app.post('/api/save_spotify_token', (req, res, next) => {
  console.log('save token');
  let access_token = req.body.access_token;
  fs.writeFile('./spotify_auth/spotifyToken.txt', access_token, (err) => {
    if (err) throw err;
  });
});

////////////////// PLAYLISTS ///////////////////////////////

//gets users playlists
app.get('/api/playlists', (req, res, next) => {

});

// inserts a newly created playlist into the db.
app.post('/api/playlists', (req, res, next) => {
  PlaylistController.insertPlaylist(req, res);
});

// Launch the server on port 3000
const server = app.listen(3000, 'localhost', () => {
  const {address, port} = server.address();
  console.log(`Listening at http://${address}:${port}`);
});
