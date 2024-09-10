module.exports = {
  encounterList: (db) => encounterList(db),
  getEncounterById: (db, encounter) => getEncounterById(db, encounter),
};

function encounterList(db) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM encounters`;

    return db.all(sql, function (err, res) {
      if (err) {
        console.error("DB Error: Select failed: ", err.message);
        return reject(err.message);
      }
      return resolve(res);
    });
  });
}

function getEncounterById(db, encounter) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM encounters WHERE id = ${encounter}`;

    return db.get(sql, function (err, res) {
      if (err) {
        console.error("DB Error: Select failed: ", err.message);
        return reject(err.message);
      }
      return resolve(res);
    });
  });
}