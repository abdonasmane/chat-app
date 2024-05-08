const status = require('http-status')
const userModel = require('../models/users.js')
const groupsModel = require('../models/groups.js')
const userGroupModel = require('../models/user_group.js')
const has = require('has-keys')
const CodeError = require('../util/CodeError.js')

module.exports = {
  async getOwnedGroups (req, res) {
    // #swagger.tags = ['Groups']
    // #swagger.summary = 'List owned groups'
    const userId = req.user.id
    const condition = { ownerId: userId }
    const data = await groupsModel.findAll({ attributes: ['id', 'name'], where: condition })
    res.json({ status: true, message: 'Returning Owned Groups', data })
  },
  async newGroup (req, res) {
    // #swagger.tags = ['Groups']
    // #swagger.summary = 'New Group'
    // #swagger.parameters['obj'] = { in: 'body', description:'Name', schema: { $name: 'Group 1' }}
    if (!has(req.body, 'name')) throw new CodeError('You must specify the name of The Group', status.BAD_REQUEST)
    const name = req.body.name
    const ownerId = req.user.id
    let groupId = await groupsModel.create({ name, ownerId })
    groupId = groupId.id
    const memberId = ownerId
    await userGroupModel.create({ member_id: memberId, groupId: groupId })
    res.json({ status: true, message: 'Group Added' })
  },
  async getMembers (req, res) {
    // #swagger.tags = ['Groups']
    // #swagger.summary = 'List members of a Group'
    const gid = req.params.gid
    const data1 = await userGroupModel.findAll({ attributes: ['member_id'], where: { groupId: gid } })
    const memberIds = data1.map(item => item.member_id)
    const data = await userModel.findAll({ attributes: ['id', 'name', 'email'], where: { id: memberIds } })
    res.json({ status: true, message: 'Members of Group returned', data })
  },
  async addMember (user, gid, uid) {
    // #swagger.tags = ['Groups']
    // #swagger.summary = 'Add a member to a group'
    const userToAdd = await userModel.findOne({ where: { id: uid } })
    if (!userToAdd) {
      throw new CodeError('User doesnt exist', status.BAD_REQUEST)
    }
    if (userToAdd.id === user.id) {
      throw new CodeError('Cannot Add Yourself twice', status.BAD_REQUEST)
    }
    const ifAlreadyExists = await userGroupModel.findOne({ where: { member_id: uid, groupId: gid } })
    if (ifAlreadyExists) {
      throw new CodeError('Member Already exist in Group', status.BAD_REQUEST)
    }
    await userGroupModel.create({ member_id: uid, groupId: gid })
    const name = await groupsModel.findOne({ attributes: ['name'], where: { id: gid } })
    return name.name
  },
  async removeMember (user, gid, uid) {
    // #swagger.tags = ['Groups']
    // #swagger.summary = 'Remove a member from a group'
    const userToAdd = await userModel.findOne({ where: { id: uid } })
    if (!userToAdd) {
      throw new CodeError('User doesnt exist', status.BAD_REQUEST)
    }
    if (userToAdd.id === user.id) {
      throw new CodeError('Cannot remove Yourself from Your group', status.BAD_REQUEST)
    }
    await userGroupModel.destroy({ where: { member_id: uid, groupId: gid } })
  },
  async getEnteredGroups (req, res) {
    // #swagger.tags = ['Groups']
    // #swagger.summary = 'List groups where user belongs'
    const userId = req.user.id
    const data1 = await userGroupModel.findAll({ attributes: ['groupId'], where: { member_id: userId } })
    const groupIds = data1.map(item => item.groupId)
    const data = await groupsModel.findAll({ attributes: ['id', 'name'], where: { id: groupIds } })
    res.json({ status: true, message: 'Entered Groups Successfully Returned', data })
  }
}
