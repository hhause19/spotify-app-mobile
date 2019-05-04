const Pool = require('pg').Pool;
const axios = require('axios');
const fs = require("fs");

class PlaylistController {
  constructor() {
    this.pool = new Pool({
      host: 'localhost',
      database: 'harrydb',
      port: 5432,
    });
  };

  /**
   * @function getPlaylists - gets all user playlists
   * @param callback
   */
  getPlaylists(callback) {
    this.pool.query(
      'SELECT * FROM playlist', (error, results) => {
        if (error) {
          throw error;
        } else {
          callback(results.rows)
        }
        //res.status(200).json(results.rows)
      }
    )
  };

  /**
   * @function insertPlaylist - inserts a new spotify playlist
   * @param req
   * @param res
   */
  insertPlaylist(req, res) {
    const {
      id, uri, name, time_range, href, collaborative, _public
    } = req.body;

    this.pool.query(
      'INSERT INTO playlist (id, uri, name, time_range, href, collaborative, public) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [id, uri, name, time_range, href, collaborative, _public], (error, results) => {
        if (error) {
          throw error
        }
        res.status(200).send(`Playlist added with ID: ${id}`)
      })
  };

  /**
   * @function updateSpotifyPlaylist - updates existing saved playlists
   */
  updateSpotifyPlaylists() {
    let dbPlaylists = [];

    // get the user playlists from the db.
    this.getPlaylists((res) => {
      dbPlaylists = res;
      console.log(res);
      console.log(dbPlaylists.map(p => p.time_range));
      dbPlaylists.map(dbPlaylist => {
        this.updateSpotifyPlaylist(dbPlaylist)
      });
    });
    // make a call to get the new playlist based on time range.

    // replace the songs in the existing playlist with the new ones.

  };

  async updateSpotifyPlaylist(dBPlaylist) {
    try {
      fs.readFile('./spotify_auth/spotifyToken.txt', 'utf8', async function (err, access_token) {
        console.log(access_token);
        console.log(dBPlaylist.time_range);
        const res = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
          params: {
            time_range: dBPlaylist.time_range,
          },
          headers: {
            'Authorization': 'Bearer ' + access_token
          }
        });
        let songs = res.data.items;
        console.log(songs)
        // let songItems = songs.map((song, i) => {
        //   return {
        //     index: i,
        //     name: song.name,
        //     artists: song.artists.map(a => a.name),
        //     albumCoverSrc: song.album.images[2].url,
        //     uri: song.uri
        //   };
        // });
        //this.setState({songItems}, this._scrollView.scrollTo({x: 0}));
      });
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = {PlaylistController};



