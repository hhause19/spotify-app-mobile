const SpotifyWebApi = require('../spotify-web-api-node');
const {cn} = require('../db/connection');

class PlaylistController {
  constructor() {
    this.spotifyApi = new SpotifyWebApi({
      accessToken: 'BQBZGQSqlyHh9phV-rijoL_2sE6U1TXJEaTe3n9QzIZMqycPAoBF9Tndz1iXf0pmQP3YcA76_7sY3epB8B-H2L2IhU0U5yfoMIvZ-grz5YImW8_0RZ-hQQ8VhoF3gbryLq_MfTP7BczFKt5KQkMbwPf_2dw7i0g_8Ne0xAHqxm79pt8XfKmXe4t31O0f10Et4cXjMmunIzSWHXptbxWENUI76ieBDOK-6fwrfS6PyG-bK2a2TLPZ2pPZYD_Z2g'
    });
  };

  /**
   * getPlaylists - gets all user playlists
   * @param callback
   */
  getPlaylists(callback) {
    cn.query(
      'SELECT * FROM playlist', (error, results) => {
        if (error) {
          throw error;
        } else {
          callback(results.rows)
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
    this.getPlaylists((dbPlaylists) => {
      dbPlaylists.map(dbPlaylist => {
        this.updateSpotifyPlaylist(dbPlaylist)
      });
    });
  };

  /**
   * updateSpotifyPlaylist - Updates a single playlist to the current top tracks
   * @param {Object} dBPlaylist playlist from DB
   */
  updateSpotifyPlaylist(dBPlaylist) {
    this.spotifyApi.getUserTopTracks({time_range: dBPlaylist.time_range, limit: 51})
      .then(res => {
        const tracksToAdd = res.body.items.map(song => song.uri);
        this.spotifyApi.getPlaylist(dBPlaylist.id)
          .then(res => {
            const tracks = res.body.tracks.items.map(item => {
              return {'uri': item.track.uri}
            });
            this.spotifyApi.removeTracksFromPlaylist(dBPlaylist.id, tracks)
              .then(res => {
                this.spotifyApi.addTracksToPlaylist(dBPlaylist.id, tracksToAdd)
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



