const { postLogOnChannel, postMessage, channelByEncounter } = require('./discordService.js');
const { readMembers, addRaidValues } = require('./googleService.js');
const { processUserLogs } = require('./userService.js');
const { getEncounterByName } = require('./encounterService.js');
const { logOnDiscord, notifyOnDiscord } = require('./discordService');
const { logDate } = require('../utils/date.js');
const { saveLogs, addAttendanceToLog, getLog, checkUserAttendance, getUserByDiscord, addSingleUserToAttendance, updateDKPs, removeUserFromAttendance } = require('../db/db.js');

module.exports = {
	addLogs: async (interaction, encounter, raiders) => {
		const membersList = await readMembers(interaction);

		// Update dkp values on excel
		const updateList = [];
		for (const member of membersList) {
			if (raiders.find(r => r.discord === member.discord)) {
				updateList.push(encounter.dkp);
			} else {
				updateList.push(0);
			}
		}
		const columnHeader = encounter.encounter + ' ' + logDate();
		await addRaidValues(interaction, columnHeader, updateList);

		// Check if any raider not found & log it
		const raidersNotFound = raiders.filter(raider => !membersList.find(member => member.discord === raider.discord));
		let logMessage = `Logs tomados para "${encounter.encounter}". Raiders online: ${raiders.length}`;
		if (raidersNotFound.length > 0) {
			const formatNames = raidersNotFound.map(r => `<@${r.discord}>`).join(', ');
			logMessage = logMessage.concat(`\nLos siguientes raiders no estan en excel: ${formatNames}\nAñadir manualmente o revisar columna "DiscordId".`);
		} 
		logOnDiscord(interaction, null, logMessage);

		// Notify discord channel
		const raiderList = raiders.map(r => `* <@${r.discord}>`).join('\n');
		const message = `Logs tomados para "${encounter.encounter}". Raiders presentes: ${raiders.length}\n${raiderList}`;
		logOnDiscord(interaction, null, message, encounter.channel);
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

// To Delete
/*addLogs: async (interaction, encounter, raiders) => {
	const users = [];
	for (const raider of raiders) {
		const user = await processUserLogs(raider, encounter);	
		users.push(user);
	}
	
	const logID = await saveLogs(encounter);
	await addAttendanceToLog(logID, users);

	await postLogOnChannel(interaction, users, logID, encounter);
},*/	
