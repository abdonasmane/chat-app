const express = require('express')
const router = express.Router()
const groups = require('../controllers/groups.js')
const verify = require('../controllers/verifyPrivilege.js')

router.get('/api/mygroups', verify.verifyToken, groups.getOwnedGroups)
router.post('/api/mygroups', verify.verifyToken, groups.newGroup)
router.get('/api/mygroups/:gid', verify.verifyToken, verify.verifyIfUserIsOwner, groups.getMembers)
router.put('/api/mygroups/:gid/:uid', verify.verifyToken, verify.verifyIfUserIsOwner, groups.addMember)
router.delete('/api/mygroups/:gid/:uid', verify.verifyToken, verify.verifyIfUserIsOwner, groups.removeMember)
router.get('/api/groupsmember', verify.verifyToken, groups.getEnteredGroups)

module.exports = router
