const userModel = require('../models/users.js')
require('../models/groups.js')
require('../models/user_group.js')
require('../models/messages.js')
const bcrypt = require('bcrypt');
// Ajouter ici les nouveaux require des nouveaux modèles

// eslint-disable-next-line no-unexpected-multiline
(async () => {
  // Regénère la base de données
  await require('../models/database.js').sync({ force: true })
  console.log('Base de données créée.')
  // Initialise la base avec quelques données
  const passhash = await bcrypt.hash('123456', 2)
  console.log(passhash)
  await userModel.create({
    name: 'Sebastien Viardot', email: 'sebastien.viardot@grenoble-inp.fr', passhash
  })
  const passhash2 = await bcrypt.hash('123456', 2)
  await userModel.create({
    name: 'Uchiha Admin', email: 'uchiha.admin@grenoble-inp.fr', passhash: passhash2, isAdmin: 1
  })
  // Ajouter ici le code permettant d'initialiser par défaut la base de donnée
})()
