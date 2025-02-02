const { logDateTime } = require('../utils/date.js');

const LOGS_CHANNEL = 'bot-logs';

module.exports = {
	logOnDiscord: (interaction, client, message, discordChannel = LOGS_CHANNEL) => {
		let logsChannel = null;
		if (interaction) {
			logsChannel = interaction.client.channels.cache.find(channel => channel.name === discordChannel);
		}
		else {
			logsChannel = client.channels.cache.find(channel => channel.name === discordChannel);
		}
		logsChannel.send(logDateTime() + message);
	},
	getChannelByName: (interaction, name) => {
		return interaction.client.channels.cache.find(channel => channel.name === name);
	},		
};
