const { SlashCommandBuilder } = require('discord.js');
const { addUserToLog } = require('../services/logService.js');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('add-to-log')
    .setDescription('Añadir usuario a un log')
    .addUserOption(option =>
			option.setName('usuario')
				.setDescription('Usuario a añadir')
				.setRequired(true))
    .addIntegerOption(option =>
      option.setName('log-id')
        .setDescription('ID del log')
        .setRequired(true)),
	
	async execute(interaction) {
    const member = interaction.options.getUser('usuario');
    const logId = interaction.options.getInteger('log-id');

    const raider = {username: member.username, discord: member.id};

    try {
      await addUserToLog(interaction, raider, logId);
      await interaction.reply(`${member} añadido al log #${logId}`);
    } catch (error) {
      await interaction.reply('Error: ' + error.message);
    }
	},  
};
