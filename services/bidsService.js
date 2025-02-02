const { logOnDiscord } = require('./discordService.js');
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
}

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}
