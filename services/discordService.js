const { userMention } = require('discord.js');
const { logDate } = require('../utils/date.js');

module.exports = {
	getChannelByName: (interaction, name) => getChannelByName(interaction, name),
	getNameByEncounter: (encounter) => {
		if (encounter.era === 'Kunark') {
			return 'kunark';
		}
		switch (encounter.type) {
		case 'Old World':
		case 'The Hole':
			return 'old-world';
		case 'Plane of Sky':
		case 'Plane of Fear':
		case 'Plane of Hate':
			return 'planes';
		default:
			return 'epic-kill';
		}
	},
	channelByEncounter: (encounter) => channelByEncounter(encounter),
	postLogOnChannel: async (interaction, users, logID, encounter) => {

		const channelName = channelByEncounter(encounter);
		const channel = getChannelByName(interaction, channelName);

		const members = users.map(user => `<@${user.discord}> - DKPs: ${user.dkp}`).join('\n');
		const header = `${encounter.name}: ${logDate()} - DKPs: ${encounter.dkp} [#${logID}]\n\n`;
		const response = header + members;
	
		channel.send(response);
	},
	postMessage: async (interaction, message, channelName) => {
		const channel = getChannelByName(interaction, channelName);
		channel.send(message);
	},
};

function getChannelByName(interaction, name) {
	return interaction.client.channels.cache.find(channel => channel.name === name);
}

function channelByEncounter(encounter) {
	if (encounter.era === 'kunark') {
		return 'kunark';
	} else if (encounter.era === 'classic') {
		return 'classic';
	} else if (encounter.name === 'Epic Encounter') {
		return 'epic-kill';
	}	else {
		return 'on-time';
	}
}
