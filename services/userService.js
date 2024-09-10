const { getUserByDiscord, updateDKPs, addNewUser } = require('../db/db.js');

module.exports = { 
  processUserLogs: async (raider, encounter) => {      
    let user = await getUserByDiscord(raider.discord);
    if (!user) {
      return await createUser(raider, encounter.dkp);
    } else {
      return await updateUser(user, encounter.dkp);
    }
  },
  createUser: async function createUser(member) {
    const id = await addNewUser(member);
    const user = {id, dkp: 0};
    return user;
  },  
}

async function updateUser(user, dkp) {
  user.dkp = user.dkp + dkp;
  updateDKPs(user);
  return user;
}

async function createUser(raider, dkp) {  
  const user = {discord: raider.discord, username: raider.username, dkp: dkp};
  const id = await addNewUser(user);
  user.id = id;      
  updateDKPs(user, dkp);
  return user;
}