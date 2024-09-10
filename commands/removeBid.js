const { SlashCommandBuilder } = require('discord.js');
const { removeBid } = require('../services/bidsService.js');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('remove-bid')
    .setDescription('Eliminar una bid')    
    .addIntegerOption(option =>
      option.setName('bid')
        .setDescription('ID de la bid a elminar')
        .setRequired(true)),
	
	async execute(interaction) {
    const bidId = interaction.options.getInteger('bid');

    try {
      await removeBid(interaction, bidId);
      await interaction.reply(`Eliminada bid [#${bidId}]`);
    } catch (error) {
      await interaction.reply(`Error: ${error.message}`);
    }
	},  
};
