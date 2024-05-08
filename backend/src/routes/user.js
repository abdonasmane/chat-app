const express = require('express')
const router = express.Router()
const user = require('../controllers/user.js')
const verify = require('../controllers/verifyPrivilege.js')

router.post('/register', user.newUser)
router.post('/login', user.login)
router.get('/api/users', verify.verifyToken, user.getUsers)
router.put('/api/password', verify.verifyToken, user.updatePassword)
router.put('/api/users/:id', verify.verifyToken, verify.verifyAdmin, user.updateUser)
router.delete('/api/users/:id', verify.verifyToken, verify.verifyAdmin, user.deleteUser)

module.exports = router
