const Pool = require('pg').Pool;

class PlaylistController {
  constructor() {
    this.pool = new Pool({
      //user: 'me',
      host: 'localhost',
      database: 'harrydb',
      //password: 'password',
      port: 5432,
    });
  }

  getPlaylists(req, res) {

  };

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
}

module.exports = {PlaylistController};



