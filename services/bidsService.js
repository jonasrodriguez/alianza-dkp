const { getUserByDiscord, getUserById, updateDKPs, addNewBid, getBidById } = require('../db/db.js');
const { postMessage } = require('./discordService.js');
const { logOnDiscord } = require('./discordService');
const { addBid } = require('./googleService.js');

module.exports = { 
  newBid: async (message) => {
    const content = message.content.split(' ');

    // Check bid format
    if (content.length !== 3) {      
      logOnDiscord(null, message.client, `Formato de bid incorrecto en "${message.content}". Ejemplo, fulano robe 10.`);
      return;
    }

    const raider = content[0];
    const item = content[1];
    const dkp = content[2];

    // Check if the dkp is a number
    if (!isNumeric(dkp)) {
      logOnDiscord(null, message.client, `Formato de bid incorrecto en "${message.content}". Ejemplo, fulano robe 10.`);
      return;
    }
    await addBid(message.client, raider, item, dkp);
    logOnDiscord(null, message.client, `Añadida bid "${message.content}".`);
  },
  addBid: async (interaction, raider, item, dkp, type) => {
    const user = await getUserByDiscord(raider.discord);
    if (!user) {
      throw new Error(`Usuario <@${raider.discord}> no encontrado`);
    }
    const bid = {userId: user.id, item: item, dkp: dkp, type: type};
    bid.id = await addNewBid(bid);

    user.dkp = user.dkp - dkp;
		await updateDKPs(user);

    await sendMessage(interaction, bid, user);
  },
  removeBid: async (interaction, bidId) => {
    const bid = await getBidById(bidId);
    if (!bid) {
      throw new Error(`Bid ${bidId} no encontrada`);
    }
    const user = await getUserById(bid.raiderID);
    if (!user) {
      throw new Error(`Usuario '${bid.raiderID}' no encontrado`);
    }

    user.dkp = user.dkp + bid.dkp;
		await updateDKPs(user);

    await sendRemoveMessage(interaction, bid, user);
  },  
}

async function sendMessage(interaction, bid, user) {
  if (bid.type === 'bid') {
    const msg = `<@${user.discord}> ha ganado '${bid.item}' por ${bid.dkp} DKPs - DKPs restantes: ${user.dkp} [#${bid.id}]`;
    await postMessage(interaction, msg, 'bids');    
  } else {
    const msg = `<@${user.discord}> ha comprado al banco '${bid.item}' por ${bid.dkp} DKPs - DKPs restantes: ${user.dkp} [#${bid.id}]`;
    await postMessage(interaction, msg, 'banco');
  }
}

async function sendRemoveMessage(interaction, bid, user) {
  if (bid.type === 'bid') {
    const msg = `Eliminada bid [#${bid.id}] de <@${user.discord}> por '${bid.item}' - DKPs restantes: ${user.dkp}`;
    await postMessage(interaction, msg, 'bids');    
  } else {
    const msg = `Eliminada compra [#${bid.id}] de <@${user.discord}> por '${bid.item}' - DKPs restantes: ${user.dkp}`;
    await postMessage(interaction, msg, 'banco');
  }
}

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}
