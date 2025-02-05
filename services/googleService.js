const { googleClient } = require('./authService');
const { excelId } = require('../config.json');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { logOnDiscord } = require('./discordService');
const { updateEncounterLists } = require('./encounterService');
const { logDate } = require('../utils/date.js');

const MEMBERS_SHEET = 'DKPS';
const RAID_SHEET = 'RAIDS';
const DKP_SHEET_NAME = 'DKP Values';
const LOOT_SHEET = 'LOG LOOT';

const ENCOUNTER_COLUMN = 'Encounter';
const DKP_COLUMN = 'DKP';
const ZONE_COLUMN = 'Zone';
const CHANNEL_COLUMN = 'Discord Channel';

const MEMBER_COLUMN = 'MIEMBRO';
const DISCORD_COLUMN = 'Discord ID';

module.exports = {
	readDKPValues: async (client) => {
    try {
      logOnDiscord(null, client, `Cargando los valores DKP de cada encounter...`);
      const excel = await openDkpSpreadsheet();
      const dkpValuesSheet = excel.sheetsByTitle[DKP_SHEET_NAME];
      const dkpValues = await dkpValuesSheet.getRows();
      const encountersList = mapExcelDkpValues(dkpValues);
      updateEncounterLists(encountersList);
      logOnDiscord(null, client, `Se han cargado correctamente ${encountersList.length} raid encounters.`);
    } catch (error) {
      logOnDiscord(null, client, 'No se pudo leer los valores de DKP del excel.' + error);
    }
	},
  readMembers: async (interaction) => {
    try {
      const excel = await openDkpSpreadsheet();
      const membersSheet = excel.sheetsByTitle[MEMBERS_SHEET];
      const members = await membersSheet.getRows();
      return mapExcelMembers(members);
    } catch (error) {
      logOnDiscord(interaction, null, 'No se pudo leer los miembros del excel.' + error);
    }
  },
  addRaidValues: async (interaction, columnHeader, dkpList) => {
    try {
      const excel = await openDkpSpreadsheet();
      const raidSheet = excel.sheetsByTitle[RAID_SHEET];

      // Load only the impacted columns
      const lastRow = raidSheet.rowCount - 1;
      let lastColumn = raidSheet.columnCount - 1;
      await raidSheet.loadCells();
      /*await raidSheet.loadCells({ 
        startRowIndex: 0, endRowIndex: lastRow, startColumnIndex: lastColumn - 1, endColumnIndex: lastColumn
      });*/

      // Update last column with dkp values
      const newRaidHeader = raidSheet.getCell(0, lastColumn);      
      newRaidHeader.value = columnHeader;
      for (let i = 0; i < dkpList.length; i++) {
        const dkpCell = raidSheet.getCell(i + 1, lastColumn);
        dkpCell.value = Number(dkpList[i]);
      }
      await raidSheet.saveUpdatedCells();

      // Add an extra column
      await raidSheet.insertDimension('COLUMNS', {startIndex: raidSheet.columnCount, endIndex: raidSheet.columnCount + 1}, true);
      
    } catch (error) {
      logOnDiscord(interaction, null, 'No se pudo actualizar los logs en el excel.' + error);
    }
  },
  addBid: async (client, raider, item, dkp) => {
    try {
      const excel = await openDkpSpreadsheet();
      const lootSheet = excel.sheetsByTitle[LOOT_SHEET];

      await lootSheet.getRows();
      await lootSheet.addRow({'LOG LOOT': logDate(), 'ITEM': item.toUpperCase(), 'MIEMBRO': raider.toUpperCase(), 'DKP': dkp});
    } catch (error) {
      logOnDiscord(null, client, 'No se pudo actualizar el bid en el excel.' + error);
    }
  }
}

// Open Alianza's DKP spreadsheet
async function openDkpSpreadsheet() {
  //const auth = await authorize();
  const client = await googleClient();
  const excel = new GoogleSpreadsheet(excelId, client);
  await excel.loadInfo(); 
  return excel;
}

// Map Encounter rows
function mapExcelDkpValues(rows) {
  let encounters = [];
  for (let i = 0; i < rows.length; i++) {
    encounters.push({
      id: i,
      encounter: rows[i].get(ENCOUNTER_COLUMN),
      dkp: rows[i].get(DKP_COLUMN),
      zone: rows[i].get(ZONE_COLUMN),
      channel: rows[i].get(CHANNEL_COLUMN),
    })
  }
  return encounters;
}

// Map Members rows
function mapExcelMembers(rows) {
  let encounters = [];
  for (let i = 0; i < rows.length; i++) {
    encounters.push({
      id: i,
      pos: i + 1,
      member: rows[i].get(MEMBER_COLUMN),
      discord: rows[i].get(DISCORD_COLUMN),
    })
  }
  return encounters;
}