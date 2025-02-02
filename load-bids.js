const fs = require('fs');
const { addAttendanceToLog, updateDKPs, getLog, getUserById } = require('./db/db.js');

class AttendanceReader {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async readAttendance() {
    const fileContent = fs.readFileSync(this.filePath, 'utf-8');
    const logs = fileContent.split('\n');

    for (var logId = 0; logId < logs.length; logId++) {
      if (logId === 0) {
        continue;
      }
      console.log(`Processing log: ${logId} of ${logs.length}`);
      var userAttendance = [];
      const realLogId = logId + 29;
      const logDb = await getLog(realLogId);

      var attendance = logs[logId].split(';');
      for (var userId = 0; userId < attendance.length; userId++) {
        if (userId === 0) {
          continue;
        }
        if (attendance[userId] !== '0') {
          const user = await getUserById(userId);
          user.dkp += logDb.dkp;
          userAttendance.push({ id: userId });
          await updateDKPs(user);
        }
      }
      addAttendanceToLog(realLogId, userAttendance);
    }
    return this.attendanceData;
  }
}

const attendanceReader = new AttendanceReader('attendance.csv');
attendanceReader.readAttendance();
