module.exports = {
  addAttendanceToLog: async (db, logID, users) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO attendance (logID, raiderID) VALUES (?, ?)';
      const statement = db.prepare(sql);
      (async () => {
        try {
          for (const user of users) {
            const raiderID = user.id;
            await new Promise((res, rej) => {
              statement.run([logID, raiderID], function (err) {
                if (err) return rej(err.message);
                res();
              });
            });
          }
          statement.finalize();
          resolve();
        } catch (err) {
          reject(err);
        }
      })();
    });
  },
  addSingleUserToAttendance: async (db, logID, user) => {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO attendance (logID, raiderID) VALUES (${logID}, ${user.id})`;
      return db.run(sql, function (err, res) {
        if (err) {
          console.error("DB Error: Insert failed: ", err.message);
          return reject(err.message);
        }
        return resolve(this.lastID);
      });
    });
  },
  checkUserAttendance: async (db, logID, userID) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM attendance WHERE logID = ${logID} AND raiderID = ${userID}`;
      return db.get(sql, function (err, res) {
        if (err) {
          console.error("DB Error: Select failed: ", err.message);
          return reject(err.message);
        }
        return resolve(res);
      });
    });
  },
  removeUserFromAttendance: async (db, logID, userID) => {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM attendance WHERE logID = ${logID} AND raiderID = ${userID}`;
      return db.run(sql, function (err, res) {
        if (err) {
          console.error("DB Error: Deletion failed: ", err.message);
          return reject(err.message);
        }
        return resolve();
      });
    });
  }
};
