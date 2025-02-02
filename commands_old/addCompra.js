const { SlashCommandBuilder, userMention } = require('discord.js');
const { addBid } = require('../services/bidsService.js');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('add-compra')
    .setDescription('Añadir compra de item')
    .addUserOption(option =>
			option.setName('usuario')
				.setDescription('Usuario comprador')
				.setRequired(true))
    .addStringOption(option =>
      option.setName('item')
        .setDescription('Descripcion del item')
        .setRequired(true))        
    .addIntegerOption(option =>
      option.setName('dkps')
        .setDescription('DKPs gastados')
        .setRequired(true)),
	
	async execute(interaction) {
    const member = interaction.options.getUser('usuario');
    const item = interaction.options.getString('item');
    const dkp = interaction.options.getInteger('dkps');

    const raider = {username: member.username, discord: member.id};
    
    try {
      await addBid(interaction, raider, item, dkp, 'compra');
      await interaction.reply(`Nueva bid para ${userMention(member.id)} '${item}' por ${dkp} dkps`);
    } catch (error) {
      await interaction.reply(`Error: ${error.message}`);
    }    
	},  
};
