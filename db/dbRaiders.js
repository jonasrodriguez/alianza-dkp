module.exports = {
  getUserByDiscord: (db, id) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM raiders WHERE discord = ${id}`;
      
      return db.get(sql, function (err, res) {
        if (err) {
          console.error("DB Error: Get user failed: ", err.message);
          return reject(err.message);
        }
        return resolve(res);
      });
    });
  },
  updateDKPs: (db, user) => {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE raiders SET dkp = ${user.dkp} WHERE id = ${user.id}`;
      return db.run(sql, function (err, res) {
        if (err) {
          console.error("DB Error: Update failed: ", err.message);
          return reject(err.message);
        }
        return resolve();
      });
    });
  },
  addNewUser: (db, user) => {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO raiders (discord, username, dkp) VALUES ('${user.discord}', '${user.username}', ${user.dkp})`;

      return db.run(sql, function (err, res) {
        if (err) {
          console.error("DB Error: Insert failed: ", err.message);
          return reject(err.message);
        }
        return resolve(this.lastID);
      });
    });
  },
  getUserById: (db, id) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM raiders WHERE id = ${id}`;
      
      return db.get(sql, function (err, row) {
        if (err) {
          console.error("DB Error: Get user failed: ", err.message);
          return reject(err.message);
        }
        return resolve(row);
      });
    });
  },
};
