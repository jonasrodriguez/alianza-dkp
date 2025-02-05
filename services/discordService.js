const { logDateTime } = require('../utils/date.js');
const { logChannelId } = require('../config.json');

module.exports = {
	logOnDiscord: (interaction, client, message) => {
		let logsChannel = null;
		if (interaction) {
			logsChannel = interaction.client.channels.cache.find(channel => channel.id === logChannelId);
		}
		else {
			logsChannel = client.channels.cache.find(channel => channel.id === logChannelId);
		}
		logsChannel.send(logDateTime() + message);
	},
	logEncounterChannel: (interaction, message, discordChannel) => {
		const encounterChannel = interaction.client.channels.cache.find(channel => channel.name === discordChannel);
		if (!encounterChannel) {
			module.exports.logOnDiscord(interaction, null, `Error: no se ha encontrado el canal "${discordChannel}"`);
			return;
		}
		encounterChannel.send(logDateTime() + message);
	},
};
