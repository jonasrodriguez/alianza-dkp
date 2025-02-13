const { logDateTime } = require('../utils/date.js');
const { discordLogsChannel } = require('../config.json');

module.exports = {
	logOnDiscord: (interaction, client, message) => {
		let logsChannel = null;
		if (interaction) {
			logsChannel = interaction.client.channels.cache.get(discordLogsChannel);
		}
		else {
			logsChannel = client.channels.cache.get(discordLogsChannel);
		}
		logsChannel.send(logDateTime() + message);
	},
	logEncounterChannel: (interaction, message, encounter) => {
		const encounterChannel = interaction.client.channels.cache.get(encounter.channelId);
		if (!encounterChannel) {
			module.exports.logOnDiscord(interaction, null, `Error: no se ha encontrado el canal "${encounter.channel}"`);
			return;
		}
		encounterChannel.send(logDateTime() + message);
	},
};
