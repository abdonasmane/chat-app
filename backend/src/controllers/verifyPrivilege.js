const status = require('http-status')
const userModel = require('../models/users.js')
const groupsModel = require('../models/groups.js')
const userGroupModel = require('../models/user_group.js')
const CodeError = require('../util/CodeError.js')
const jws = require('jws')
require('mandatoryenv').load(['TOKENSECRET'])
const { TOKENSECRET } = process.env

module.exports = {
  async verifyToken (req, res, next) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Token And User Existence verification'
    if (!req.headers || !Object.prototype.hasOwnProperty.call(req.headers, 'x-access-token')) {
      throw new CodeError('Token missing', status.FORBIDDEN)
    }
    if (!jws.verify(req.headers['x-access-token'], 'HS256', TOKENSECRET)) {
      throw new CodeError('Token invalid', status.FORBIDDEN)
    }
    const userEmail = jws.decode(req.headers['x-access-token']).payload.toLowerCase()
    const user = await userModel.findOne({ where: { email: userEmail } })
    if (!user) {
      throw new CodeError('User doesnt exist', status.FORBIDDEN)
    }
    req.user = user
    next()
  },
  verifyAdmin (req, res, next) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Admin Privileges verification'
    if (req.user.isAdmin !== 1) throw new CodeError('Forbidden access', status.FORBIDDEN)
    next()
  },
  async verifyIfUserIsOwner (req, res, next) {
    // #swagger.tags = ['Groups']
    // #swagger.summary = 'Verify if the user is the owner of the group'
    const userId = req.user.id
    const condition = { id: req.params.gid, ownerId: userId }
    const data = await groupsModel.findOne({ where: condition })
    if (!data) {
      throw new CodeError('FORBIDDEN ACCESS TO THIS GROUP', status.FORBIDDEN)
    }
    next()
  },
  async verifyIfMember (req, res, next) {
    // #swagger.tags = ['Messages']
    // #swagger.summary = 'Verify if user belongs to group'
    const userId = req.user.id
    const condition = { member_id: userId, groupId: req.params.gid }
    const data = await userGroupModel.findOne({ where: condition })
    if (!data) {
      throw new CodeError('FORBIDDEN ACCESS TO THIS GROUP', status.FORBIDDEN)
    }
    next()
  }
}
