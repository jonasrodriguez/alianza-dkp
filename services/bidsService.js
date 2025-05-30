const { logOnDiscord } = require('./discordService.js');
const { addBid } = require('./googleService.js');

module.exports = { 
  newBid: async (message) => {
    const content = message.content.split(' ');

    // Check bid format
    if (content.length < 3) {
      logOnDiscord(null, message.client, `Formato de bid incorrecto en "${message.content}". Ejemplo, fulano robe 10.`);
      return;
    }

    const raider = content[0];
    const dkp = content[content.length - 1];

    // Merge all content except the first and last into the item
    const item = content.slice(1, content.length - 1).join(' ');

    // Check if the dkp is a number
    if (!isNumeric(dkp)) {
      logOnDiscord(null, message.client, `Formato de bid incorrecto en "${message.content}". Ejemplo, fulano robe 10.`);
      return;
    }
    await addBid(message.client, raider, item, -dkp);
    logOnDiscord(null, message.client, `Añadida bid "${message.content}".`);
  },
}

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}
