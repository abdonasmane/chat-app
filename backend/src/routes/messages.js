const express = require('express')
const router = express.Router()
const messages = require('../controllers/messages.js')
const verify = require('../controllers/verifyPrivilege.js')

router.get('/api/messages/:gid', verify.verifyToken, verify.verifyIfMember, messages.getPostedMessages)
router.post('/api/messages/:gid', verify.verifyToken, verify.verifyIfMember, messages.addMessage)

module.exports = router
