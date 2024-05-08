const messages = require('../models/messages.js')
require('mandatoryenv').load(['TOKENSECRET'])

module.exports = {
  async getPostedMessages (req, res) {
    // #swagger.tags = ['Messages']
    // #swagger.summary = 'List posted messages'
    // #swagger.parameters['obj'] = { in: 'body', description:'Content of message', schema: { $content: 'New message'}}
    const condition = { groupId: req.params.gid }
    const data = await messages.findAll({ attributes: ['id', 'content', 'createdAt', 'userId'], where: condition })
    res.json({ status: true, message: 'Returning Posted messages', data })
  },
  async addMessage (user, gid, content) {
    // #swagger.tags = ['Messages']
    // #swagger.summary = 'add new message'
    const userId = user.id
    const message = { content: content, createdAt: new Date(), userId: userId, groupId: gid }
    await messages.create(message)
    return { ...message, userName: user.name }
  }
}
