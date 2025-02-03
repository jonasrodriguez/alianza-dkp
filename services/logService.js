const { readMembers, addRaidValues } = require('./googleService.js');
const { logOnDiscord, logEncounterChannel } = require('./discordService');
const { logDate } = require('../utils/date.js');

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
		logEncounterChannel(interaction, message, encounter.channel);
	},	
};
