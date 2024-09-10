const { getUserByDiscord } = require('../db/db.js');

module.exports = { 
  dkpData: async (raider, lang) => {

    const user = await getUserByDiscord(raider.id);
    if (!user) {
      return 'Usuario no encontrado';
    }

    return lang === 'en' ? responseMessageEN(user) : responseMessageES(user);
  },    
}

function responseMessageEN(user){
  return `Total DKPs for <@${user.discord}>:	${user.dkp}`;
}

function responseMessageES(user){
  return `DKPs totales de <@${user.discord}>:	${user.dkp}`;
}
