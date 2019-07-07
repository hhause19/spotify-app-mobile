const cn = require('../db/connection');
const fs = require('fs');
const spotifyApi = require('../db/spotifyBackendApi');

class PlaylistController {
  constructor() {
  };

  /**
   * getPlaylists - gets all user playlists from db, and returns the
   * corresponding spotify ones
   * @param callback
   */
  getPlaylists(req, res) {
    cn.query(
      'SELECT * FROM playlist', (error, results) => {
        if (error) {
          throw error;
        } else {
          let playlists = [];
          Promise.all(results.rows.map(playlist => {
            return spotifyApi.getPlaylist(playlist.id)
          }))
            .then(data => {
              console.log(data);
              data.map(playlist => {
                playlists = playlists.concat(playlist.body);
              });
              res.status(200).send(playlists);
            })
        }
      }
    )
  };

  /**
   * insertPlaylist - inserts a new spotify playlist
   * @param req
   * @param res
   */
  insertPlaylist(req, res) {
    const {
      id, uri, name, time_range, href, collaborative, _public
    } = req.body;

    cn.query(
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
   * updateSpotifyPlaylist
   * Gets all playlists from db and updates each one
   */
  updateSpotifyPlaylists() {
    // refresh the access token
    spotifyApi.refreshAccessToken()
      .then(data => {
        // Set access token and update playlists
        spotifyApi.setAccessToken(data.body['access_token']);

        // update the expire time
        const expirationTime = new Date().getTime() + data.body['expires_in'] * 1000;
        fs.writeFile('./spotify_auth/expirationTime.txt', expirationTime, (err) => {
          if (err) throw err;
        });

        this.getPlaylists((dbPlaylists) => {
          dbPlaylists.map(dbPlaylist => {
            this.updateSpotifyPlaylist(dbPlaylist)
          });
        });
      })
      .catch(err => {
        console.log('Could not refresh access token', err);
      });
  };

  /**
   * updateSpotifyPlaylist - Updates a single playlist to the current top tracks
   * @param {Object} dBPlaylist playlist from DB
   */
  updateSpotifyPlaylist(dBPlaylist) {
    spotifyApi.getUserTopTracks({time_range: dBPlaylist.time_range, limit: 51})
      .then(res => {
        const tracksToAdd = res.body.items.map(song => song.uri);
        spotifyApi.getPlaylist(dBPlaylist.id)
          .then(res => {
            const tracks = res.body.tracks.items.map(item => {
              return {'uri': item.track.uri}
            });
            spotifyApi.removeTracksFromPlaylist(dBPlaylist.id, tracks)
              .then(res => {
                spotifyApi.addTracksToPlaylist(dBPlaylist.id, tracksToAdd)
                  .then(res =>
                    console.log(`Updated playlist: ${dBPlaylist.name}: ${dBPlaylist.id}`))
                  .catch(err => {
                    console.log('Error updating playlist');
                    console.log(err);
                  })
              })
              .catch((err) => {
                console.log('Error removing playlist songs');
                console.log(err);
              })
          })
          .catch(err => {
            console.log(`Error getting playlist with ID: ${dBPlaylist.id}`);
            console.log(err)
          });
      })
      .catch(err => {
        console.log('Error getting user top tracks');
        console.log(err)
      });
  }
}

module.exports = {PlaylistController};



