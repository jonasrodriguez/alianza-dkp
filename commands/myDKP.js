const { SlashCommandBuilder } = require('discord.js');
const { dkpData } = require('../services/dkpService.js');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('my-dkps')
    .setDescription('User DKPs'),
	
	async execute(interaction) {
    const response = await dkpData(interaction.member, 'en');
    await interaction.reply(response);
	},  
};
