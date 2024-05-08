const Sequelize = require('sequelize')
const db = require('./database.js')
const users = require('./users.js')
const groups = require('./groups.js')
const messages = db.define('messages', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  content: {
    type: Sequelize.STRING(128)
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  groupId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'groups',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  }
}, { timestamps: false })

messages.belongsTo(users, { foreignKey: 'userId' })
users.hasMany(messages, { foreignKey: 'userId' })

messages.belongsTo(groups, { foreignKey: 'groupId' })
groups.hasMany(messages, { foreignKey: 'groupId' })

module.exports = messages
