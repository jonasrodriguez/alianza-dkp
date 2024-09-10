const { SlashCommandBuilder } = require('discord.js');
const { removeUserFromLog } = require('../services/logService.js');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('remove-from-log')
    .setDescription('Eliminar un usuario de un log')
    .addUserOption(option =>
			option.setName('usuario')
				.setDescription('Usuario a eliminar')
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
      removeUserFromLog(interaction, raider, logId);
      await interaction.reply(`${member} elimindo del log #${logId}`);
    } catch (error) {      
      await interaction.reply('Error: ' + error.message);
    }    
	},  
};
