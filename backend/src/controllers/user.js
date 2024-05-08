const status = require('http-status')
const userModel = require('../models/users.js')
const has = require('has-keys')
const CodeError = require('../util/CodeError.js')
const bcrypt = require('bcrypt')
const jws = require('jws')
require('mandatoryenv').load(['TOKENSECRET'])
const { TOKENSECRET } = process.env

function validPassword (password) {
  return /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(password)
}

function validEmail (email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validName (name) {
  return /^[a-z\-'\s]{1,128}$/i.test(name)
}

module.exports = {
  async login (req, res) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Verify credentials of user using email and password and return token'
    // #swagger.parameters['obj'] = { in: 'body', schema: { $email: 'John.Doe@acme.com', $password: '12345'}}
    if (!has(req.body, ['email', 'password'])) throw new CodeError('You must specify the email and password', status.BAD_REQUEST)
    const { email, password } = req.body
    const user = await userModel.findOne({ where: { email: email.toLowerCase() } })
    if (user && await bcrypt.compare(password, user.passhash)) {
      const token = jws.sign({ header: { alg: 'HS256' }, payload: email, secret: TOKENSECRET })
      res.json({ status: true, message: 'Login/Password ok', token })
    } else {
      throw new CodeError('Wrong email/password', status.FORBIDDEN)
    }
  },
  async newUser (req, res) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Adding new user'
    // #swagger.parameters['obj'] = { in: 'body', description:'Name and email and password', schema: { $name: 'John Doe', $email: 'John.Doe@acme.com', $password: '1m02P@SsF0rt!'}}
    if (!has(req.body, ['name', 'email', 'password'])) throw new CodeError('You must specify the name and email', status.BAD_REQUEST)
    const { name, email, password } = req.body
    if (!validPassword(password)) throw new CodeError('Weak password!', status.BAD_REQUEST)
    if (!validEmail(email)) throw new CodeError('Invalid email!', status.BAD_REQUEST)
    if (!validName(name)) throw new CodeError('Invalid name!', status.BAD_REQUEST)
    const user = await userModel.findOne({ where: { email: email.toLowerCase() } })
    if (!user) {
      await userModel.create({ name: name, email: email.toLowerCase(), passhash: await bcrypt.hash(password, 2) })
      res.json({ status: true, message: 'User Added' })
    } else {
      throw new CodeError('Email already taken, please choose another one', status.BAD_REQUEST)
    }
  },
  async getUsers (req, res) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Get All users'
    const data = await userModel.findAll({ attributes: ['id', 'name', 'email'] })
    res.json({ status: true, message: 'Returning users', data })
  },
  async updateUser (req, res) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Mettre à jour les informations de l utilisateur (réservé à un utilisateur administrateur)'
    // #swagger.parameters['obj'] = { in: 'body', schema: { $name: 'John Doe', $email: 'John.Doe@acme.com', $password: '1m02P@SsF0rt!', $isAdmin: '1' }}
    const userModified = {}
    for (const field of ['name', 'email', 'password', 'isAdmin']) {
      if (has(req.body, field)) {
        switch (field) {
          case 'password':
            if (!validPassword(req.body.password)) throw new CodeError('Weak password!', status.BAD_REQUEST)
            userModified.passhash = await bcrypt.hash(req.body.password, 2)
            break
          case 'name':
            if (!validName(req.body.name)) throw new CodeError('Invalid name!', status.BAD_REQUEST)
            userModified.name = req.body.name
            break
          case 'email':
            if (!validEmail(req.body.email)) throw new CodeError('Invalid email!', status.BAD_REQUEST)
            userModified.email = req.body.email.toLowerCase()
            break
          case 'isAdmin':
            if (!(req.body.isAdmin === 0 || req.body.isAdmin === 1)) throw new CodeError('isAdmin attribute must be 0 or 1', status.BAD_REQUEST)
            userModified.isAdmin = req.body.isAdmin
        }
      }
    }
    if (Object.keys(userModified).length === 0) throw new CodeError('You must specify the name, email, password or isAdmin', status.BAD_REQUEST)
    await userModel.update(userModified, { where: { id: req.params.id } })
    res.json({ status: true, message: 'User updated' })
  },
  async deleteUser (req, res) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Delete User'
    const { id } = req.params
    await userModel.destroy({ where: { id } })
    res.json({ status: true, message: 'User deleted' })
  },
  async updatePassword (req, res) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Update Password'
    // #swagger.parameters['obj'] = { in: 'body', description:'new password', schema: { $password: 'newPass1m02P@SsF0rt!'}}
    if (!has(req.body, 'password')) {
      throw new CodeError('You must specify the new Password', status.BAD_REQUEST)
    }
    if (!validPassword(req.body.password)) {
      throw new CodeError('Weak password!', status.BAD_REQUEST)
    }
    const condition = { email: req.user.email }
    const update = { passhash: await bcrypt.hash(req.body.password, 2) }
    await userModel.update(update, { where: condition })
    res.json({ status: true, message: 'Password updated' })
  }
}
