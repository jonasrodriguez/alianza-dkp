const { SlashCommandBuilder } = require('discord.js');
const { discordRaidVoiceChannel } = require('../config.json');
const { addLogs } = require('../services/logService.js');
const { getEncountersNameList, getEncounterByName } = require('../services/encounterService.js');
const { logDateTime } = require('../utils/date.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('logs')
		.setDescription('Toma logs del canal RAID')
    .addStringOption(option =>
      option.setName('encouter')
        .setDescription('Encounter actual')
        .setRequired(true)
        .setAutocomplete(true))
    .addBooleanOption(option =>
      option.setName('firstkill')
        .setDescription('Encounter first kill')),
	
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const encounters = getEncountersNameList();
    
    let filtered = [];
    if (!focusedValue) {
      filtered = encounters.slice(0, 24);
    } else{
      filtered = encounters.filter(encounter => encounter.toLowerCase().includes(focusedValue.toLowerCase()));
    }
    await interaction.respond(filtered.map(f => ({ name: f, value: f })));
  },

	async execute(interaction) {
		const raidChannel = interaction.client.channels.cache.find(channel => channel.id === discordRaidVoiceChannel);
    if (raidChannel.members.size === 0) {
      await interaction.reply("No hay nadie en el canal RAID");
      return;
    }
    const reaiders = raidChannel.members.map(member => ({username: member.user.username, discord: member.user.id}));

    const encounterName = interaction.options.getString('encouter');    
    const encounter = getEncounterByName(encounterName);

    const firstKill = interaction.options.getBoolean('firstkill');
    encounter.firstKill = firstKill ? 1 : 0;

    if (firstKill) {
      encounter.dkp = encounter.dkp * 2;
    }

    addLogs(interaction, encounter, reaiders);

		await interaction.reply(logDateTime() + `Procesando logs para '${encounter.name}'...`);
	},
};
