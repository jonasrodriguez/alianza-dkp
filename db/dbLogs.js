const { dbDate } = require('../utils/date.js');

module.exports = {
  saveLogs: async (db, encounter) =>{
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO logs (encounter, dkp, description, date, first_kill) VALUES ('${encounter.name}', ${encounter.dkp}, '${encounter.description}', '${dbDate()}', ${encounter.firstKill})`;
      return db.run(sql, function (err, res) {
        if (err) {
          console.error("DB Error: Insert failed: ", err.message);
          return reject(err.message);
        }
        return resolve(this.lastID);
      });
    });
  },
  getLog: async (db, logId) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM logs WHERE id = ${logId}`;
      return db.get(sql, function (err, row) {
        if (err) {
          console.error("DB Error: Insert failed: ", err.message);
          return reject(err.message);
        }
        return resolve(row);
      });
    });
  },
  updateLogMembers: async (db, logId, members) => {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE logs SET members = '${members}' WHERE id = ${logId}`;
      return db.run(sql, function (err, row) {
        if (err) {
          console.error("DB Error: Insert failed: ", err.message);
          return reject(err.message);
        }
        return resolve();
      });
    });
  },
};
