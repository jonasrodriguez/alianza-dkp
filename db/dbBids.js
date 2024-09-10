const { dbDate } = require('../utils/date.js');

module.exports = {
  addNewBid: (db, bid) => {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO bids (raiderID, item, dkp, type, date) VALUES (${bid.userId}, '${bid.item}', ${bid.dkp}, '${bid.type}', '${dbDate()}')`;
      return db.run(sql, function (err, res) {
        if (err) {
          console.error("DB Error: Insert failed: ", err.message);
          return reject(err.message);
        }
        return resolve(this.lastID);
      });
    });
  },
  removeBid: (db, bidId) => {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM bids WHERE id = ${bidId}`;
      return db.run(sql, function (err, res) {
        if (err) {
          console.error("DB Error: Deletion failed: ", err.message);
          return reject(err.message);
        }
        return resolve(this.lastID);
      });
    });
  },
  getBidById: (db, bidId) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM bids WHERE id = ${bidId}`;
      return db.get(sql, function (err, row) {
        if (err) {
          console.error("DB Error: Gettting bids: ", err.message);
          return reject(err.message);
        }
        return resolve(row);
      });
    });
  },  
};
