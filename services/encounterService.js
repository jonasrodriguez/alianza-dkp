const { logOnDiscord } = require('./discordService');

const encounters = [];

module.exports = {
	updateEncounterLists: (encounterList) => {
		encounterList.forEach(e => encounters.push(e));
	},
	getEncounterByName: (encounterName, interaction) => {
		const encounter = encounters.find(e => e.encounter === encounterName);
		if (encounter) {
			return encounter;
		}
		logOnDiscord(interaction, null, 'Error: No se han encontrado datos del encounter ' + encounterName);
		return null;
	},
	getEncountersNameList: () => {
		return encounters.map(e => e.encounter);
	}
};