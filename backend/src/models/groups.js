const Sequelize = require('sequelize')
const db = require('./database.js')
const users = require('./users.js')
const groups = db.define('groups', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(128),
    unique: true
  },
  ownerId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  }
}, { timestamps: false })

groups.belongsTo(users, { foreignKey: 'ownerId' })
users.hasMany(groups, { foreignKey: 'ownerId' })

module.exports = groups
