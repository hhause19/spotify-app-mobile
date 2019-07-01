const cn = require('../db/connection.js');
class UserController {
  constructor() {

  }

   getUser(req, res) {
    console.log(req.body);
  }
}

module.exports = {UserController};
