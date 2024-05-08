const status = require('http-status')
const userModel = require('../models/users.js')
const groupsModel = require('../models/groups.js')
const userGroupModel = require('../models/user_group.js')
const CodeError = require('../util/CodeError.js')
const jws = require('jws')
require('mandatoryenv').load(['TOKENSECRET'])
const { TOKENSECRET } = process.env

module.exports = {
  async verifyToken (token) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Token And User Existence verification'
    if (!jws.verify(token, 'HS256', TOKENSECRET)) {
      throw new CodeError('Token invalid', status.FORBIDDEN)
    }
    const userEmail = jws.decode(token).payload.toLowerCase()
    const user = await userModel.findOne({ where: { email: userEmail } })
    if (!user) {
      throw new CodeError('User doesnt exist', status.FORBIDDEN)
    }
    return user
  },
  verifyAdmin (user) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Admin Privileges verification'
    if (user.isAdmin !== 1) throw new CodeError('Forbidden access', status.FORBIDDEN)
  },
  async verifyIfUserIsOwner (user, gid) {
    // #swagger.tags = ['Groups']
    // #swagger.summary = 'Verify if the user is the owner of the group'
    const userId = user.id
    const condition = { id: gid, ownerId: userId }
    const data = await groupsModel.findOne({ where: condition })
    if (!data) {
      throw new CodeError('FORBIDDEN ACCESS TO THIS GROUP', status.FORBIDDEN)
    }
  },
  async verifyIfMember (user, gid) {
    // #swagger.tags = ['Messages']
    // #swagger.summary = 'Verify if user belongs to group'
    const userId = user.id
    const condition = { member_id: userId, groupId: gid }
    const data = await userGroupModel.findOne({ where: condition })
    if (!data) {
      throw new CodeError('FORBIDDEN ACCESS TO THIS GROUP', status.FORBIDDEN)
    }
  }
}
