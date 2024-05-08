const Sequelize = require('sequelize')
const db = require('./database.js')
const users = require('./users.js')
const groups = require('./groups.js')
const userGroup = db.define('User_Group', {
  member_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
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
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'groups',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  }
}, { timestamps: false })

userGroup.belongsTo(users, { foreignKey: 'member_id' })
userGroup.belongsTo(groups, { foreignKey: 'groupId' })
users.hasMany(userGroup, { foreignKey: 'member_id' })
groups.hasMany(userGroup, { foreignKey: 'groupId' })

module.exports = userGroup
