const { SlashCommandBuilder } = require('discord.js');
const { clearEncounters } = require('../services/encounterService.js');
const { readDKPValues } = require('../services/googleService.js');
const { logDateTime } = require('../utils/date.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload-encounters')
		.setDescription('Carga de nuevo los valores de los encounters del excel'),
	
	async execute(interaction) {

		clearEncounters();
		readDKPValues(interaction.client);

		await interaction.reply(logDateTime() + "Recargando valores de encounters del excel...");
	},
};
