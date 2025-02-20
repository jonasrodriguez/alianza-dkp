const { SlashCommandBuilder } = require('discord.js');
const { discordRaidVoiceChannel } = require('../config.json');
const { addLogs } = require('../services/logService.js');
const { getEncounterByName } = require('../services/encounterService.js');
const { logDateTime } = require('../utils/date.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('manual-logs')
		.setDescription('Toma logs del canal RAID añadiendo el encounter manualmente')
    .addStringOption(option =>
      option.setName('encouter')
        .setDescription('Descripcion del encounter')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('dkps')
        .setDescription('DKP del encounter')),
	
	async execute(interaction) {
		const raidChannel = interaction.client.channels.cache.find(channel => channel.id === discordRaidVoiceChannel);
    if (raidChannel.members.size === 0) {
      await interaction.reply("No hay nadie en el canal RAID");
      return;
    }
    const reaiders = raidChannel.members.map(member => ({username: member.user.username, discord: member.user.id}));

    const encounterName = interaction.options.getString('encouter');      
    const dkp = interaction.options.getInteger('dkps');

    const epicFightEncounter = getEncounterByName('Epic Kills');
    epicFightEncounter.name = encounterName
    epicFightEncounter.dkp = dkp;

    addLogs(interaction, epicFightEncounter, reaiders);

		await interaction.reply(logDateTime() + `Procesando manual logs para '${encounterName}'...`);
	},
};
