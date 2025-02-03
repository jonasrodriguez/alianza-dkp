const { SlashCommandBuilder } = require('discord.js');
const { getEncounterByName } = require('../services/encounterService.js');
const { addLogs } = require('../services/logService.js');
const { raidChannelId } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('on-time')
		.setDescription('Toma logs OnTime del canal RAID'),
	
	async execute(interaction) {
		const raidChannel = interaction.client.channels.cache.find(channel => channel.id === raidChannelId);
    if (raidChannel.members.size === 0) {
      await interaction.reply("No hay nadie en el canal RAID");
      return;
    }
		const reaiders = raidChannel.members.map(member => ({username: member.user.username, discord: member.user.id}));
		const encounter = getEncounterByName('On Time', interaction);

		addLogs(interaction, encounter, reaiders);

		await interaction.reply("Procesando logs OnTime...");
	},
};
