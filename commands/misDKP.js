const { SlashCommandBuilder } = require('discord.js');
const { dkpData } = require('../services/dkpService.js');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('mis-dkps')
    .setDescription('DKPs de un usuario'),
	
	async execute(interaction) {
    const member = interaction.member.user;
    const response = await dkpData(interaction.member.user, 'es');
    await interaction.reply(response);
	},  
};
