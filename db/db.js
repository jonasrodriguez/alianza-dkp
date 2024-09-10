const sqlite3 = require('sqlite3').verbose();
const { saveLogs, getLog, updateLogMembers } = require('./dbLogs.js');
const { getUserByDiscord, updateDKPs, addNewUser, getUserById } = require('./dbRaiders.js');
const { getEncounterById, encounterList } = require('./dbEncounters.js');
const { addNewBid, removeBid, getBidById } = require('./dbBids.js');
const { addAttendanceToLog, checkUserAttendance, addSingleUserToAttendance, removeUserFromAttendance } = require('./dbAttendance.js');

let db = new sqlite3.Database('./dkp.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the alianza dkp database.');
  });

module.exports = { 
  addNewUser: (user) => addNewUser(db, user),
  getUserById: (id) => getUserById(db, id),
  getUserByDiscord: (id) => getUserByDiscord(db, id),
  updateDKPs: (user) => updateDKPs(db, user),

  getLog: (logId) => getLog(db, logId),
  saveLogs: (encounter) => saveLogs(db, encounter),
  updateLogMembers: (logId, members) => updateLogMembers(db, logId, members),

  getEncounterById: (encounter) => getEncounterById(db, encounter),
  encounterList: () => encounterList(db),
  
  addNewBid: (bid) => addNewBid(db, bid),
  removeBid: (bidId) => removeBid(db, bidId),
  getBidById: (bidId) => getBidById(db, bidId),

  addAttendanceToLog: (logID, users) => addAttendanceToLog(db, logID, users),
  addSingleUserToAttendance: (logID, user) => addSingleUserToAttendance(db, logID, user),
  removeUserFromAttendance: (logID, user) => removeUserFromAttendance(db, logID, user),
  checkUserAttendance: (logID, userID) => checkUserAttendance(db, logID, userID),
}
