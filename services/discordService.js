const { logDateTime } = require('../utils/date.js');
const { discordLogsChannel } = require('../config.json');

module.exports = {
	logOnDiscord: (interaction, client, message) => {
		let logsChannel = null;
		if (interaction) {
			logsChannel = interaction.client.channels.cache.find(channel => channel.id === discordLogsChannel);
		}
		else {
			logsChannel = client.channels.cache.find(channel => channel.id === discordLogsChannel);
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
