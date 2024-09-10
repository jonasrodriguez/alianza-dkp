const { postLogOnChannel, postMessage, channelByEncounter } = require('./discordService.js');
const { processUserLogs } = require('./userService.js');
const { getEncounterByName } = require('./encounterService.js');
const { saveLogs, addAttendanceToLog, getLog, checkUserAttendance, getUserByDiscord, addSingleUserToAttendance, updateDKPs, removeUserFromAttendance } = require('../db/db.js');

module.exports = {
	addLogs: async (interaction, encounter, raiders) => {
		const users = [];
		for (const raider of raiders) {
			const user = await processUserLogs(raider, encounter);	
			users.push(user);
		}
		
		const logID = await saveLogs(encounter);
		await addAttendanceToLog(logID, users);

		await postLogOnChannel(interaction, users, logID, encounter);
	},	
	addUserToLog: async (interaction, raider, logID) => {
		const log = await getLog(logID);
		if (!log) {
			throw new Error(`Log #${logID} no encontrado`);			
		}
		const user = await getUserByDiscord(raider.discord);
		const attendance = await checkUserAttendance(logID, user.id);
		if (attendance) {
			throw new Error(`El usuario <@${user.discord}> ya esta en el log #${logID}`);
		}

		await processUserLogs(raider, {dkp: log.dkp});
		await addSingleUserToAttendance(logID, user);

		const encounter = getEncounterByName(log.encounter);
		const channelName = channelByEncounter(encounter);
    const msg = `<@${user.discord}> ha sido añadido al log de ${log.encounter} ${log.description} - ${log.date} [#${logID}]`;

		await postMessage(interaction, msg, channelName);
	},
	removeUserFromLog: async (interaction, raider, logID) => {
		const log = await getLog(logID);
		if (!log) {
			throw new Error(`Log #${logID} no encontrado`);			
		}
		const user = await getUserByDiscord(raider.discord);
		const attendance = await checkUserAttendance(logID, user.id);
		if (!attendance) {
			throw new Error(`El usuario <@${user.discord}> no esta en el log #${logID}`);
		}

		user.dkp = user.dkp - log.dkp;
		await updateDKPs(user, newDKP);
		await removeUserFromAttendance(logID, user.id);

		const encounter = getEncounterByName(log.encounter);
		const channelName = channelByEncounter(encounter);
    const msg = `<@${user.discord}> ha sido eliminado del log de ${log.encounter} ${log.description} - ${log.date} [#${logID}]`;

		await postMessage(interaction, msg, channelName);
	},		
};
