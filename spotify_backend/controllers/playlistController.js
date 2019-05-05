const Pool = require('pg').Pool;
const SpotifyWebApi = require('../spotify-web-api-node');
require('dotenv').config();

class PlaylistController {
  constructor() {
    this.pool = new Pool({
      host: 'localhost',
      database: 'harrydb',
      port: 5432,
    });
    this.spotifyApi = new SpotifyWebApi({
      accessToken: 'BQBvYXS3egEZ-zsA6sYvyuklSwds1tzGDt936dtG7MnRuO8Cs_MctUQvFquW-0jtMHFS-9OLzZa9g-1cXtyCLQYze3gzSQDCAaLaNu6iaGC3WtSa1I7CEaJvdBzCkzpI-v_ZfeNNbur82zzCn4YwGchjynXHL6PUHeweR5dZta7ZliuYd-DXeFB0nXjWZZf5kL3DDjbpuMBTmcPuupdZq2hhIhAq02DPyKOG518cZp8oVIVJV_vh_mQMZKL6sw'
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
   * @function updateSpotifyPlaylist
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
   * @function updateSpotifyPlaylist
   * Updates a single playlist to the current top tracks
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



