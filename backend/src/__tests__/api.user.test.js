const app = require('../app')
const request = require('supertest')

test('Test if user can log in and list users', async () => {
  let response = await request(app)
    .post('/login')
    .send({ email: 'Sebastien.Viardot@grenoble-inp.fr', password: '123456' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')
  response = await request(app)
    .get('/api/users')
    .set('x-access-token', response.body.token)
  expect(response.statusCode).toBe(200)
  expect(response.body.message).toBe('Returning users')
  expect(response.body.data.length).toBeGreaterThan(0)
})

test('Missing token and invalid token', async () => {
  // login
  let response = await request(app)
    .post('/login')
    .send({ email: 'Sebastien.Viardot@grenoble-inp.fr', password: '123456' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  const token = response.body.token

  // listing all users
  response = await request(app)
    .get('/api/users')
    .set('x-access-token', token)
  expect(response.statusCode).toBe(200)

  // listing all users wihout token
  response = await request(app)
    .get('/api/users')
  expect(response.statusCode).toBe(403)
  expect(response.body.message).toBe('Token missing')

  // listing all users with invalid token
  response = await request(app)
    .get('/api/users')
    .set('x-access-token', token + 'hh')
  expect(response.statusCode).toBe(403)
  expect(response.body.message).toBe('Token invalid')
})

test('Test if user can create an account and log in, and update its pass, and log in using old pass', async () => {
  const mail = 'madara@gmail.com'
  const pass = 'MyP@ssw0rd!'
  const newPass = 'updatedMyP@ssw0rd!'
  const nom = 'uchiha'
  // adding new user
  let response = await request(app)
    .post('/register')
    .send({ name: nom, email: mail, password: pass })
  expect(response.statusCode).toBe(200)
  expect(response.body.message).toBe('User Added')

  // adding new user with same info
  response = await request(app)
    .post('/register')
    .send({ name: nom, email: mail, password: pass })
  expect(response.statusCode).toBe(400)
  expect(response.body.message).toBe('Email already taken, please choose another one')

  // login
  response = await request(app)
    .post('/login')
    .send({ email: mail, password: pass })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  const token = response.body.token

  // changing password to weak password
  response = await request(app)
    .put('/api/password')
    .set('x-access-token', token)
    .send({ password: '111' })
  expect(response.statusCode).toBe(400)

  // missing password attribute during password update
  response = await request(app)
    .put('/api/password')
    .set('x-access-token', token)
  expect(response.statusCode).toBe(400)

  // changing password
  response = await request(app)
    .put('/api/password')
    .set('x-access-token', token)
    .send({ password: newPass })
  expect(response.statusCode).toBe(200)
  expect(response.body.message).toBe('Password updated')

  // trying to log in using old password
  response = await request(app)
    .post('/login')
    .send({ email: mail, password: pass })
  expect(response.statusCode).toBe(403)
  expect(response.body.message).toBe('Wrong email/password')
})

test('Test login with invalid info', async () => {
  // no email no password
  let response = await request(app)
    .post('/login')
  expect(response.statusCode).toBe(400)
  // wrong email
  response = await request(app)
    .post('/login')
    .send({ email: 'doesntExist', password: 'muchaLucha' })
  expect(response.statusCode).toBe(403)
  // wrong password
  response = await request(app)
    .post('/login')
    .send({ email: 'Sebastien.Viardot@grenoble-inp.fr', password: 'muchaLucha' })
  expect(response.statusCode).toBe(403)
})

test('Test create user with invalid info', async () => {
  // no email no password no name
  let response = await request(app)
    .post('/register')
  expect(response.statusCode).toBe(400)
  // weak password
  response = await request(app)
    .post('/register')
    .send({ email: 'Sebastien.Viardot@grenoble-inp.fr', password: '111', name: 'username' })
  expect(response.statusCode).toBe(400)
  // invalid email
  response = await request(app)
    .post('/register')
    .send({ email: 'emailInvalid', password: 'MyP@ssw0rd!', name: 'username' })
  expect(response.statusCode).toBe(400)
  // invalid name
  response = await request(app)
    .post('/register')
    .send({ email: 'Uchiha@grenoble-inp.fr', password: 'MyP@ssw0rd!', name: 'user123' })
  expect(response.statusCode).toBe(400)
})

test('Test Admin functionalities', async () => {
  // login with no admin
  let response = await request(app)
    .post('/login')
    .send({ email: 'Sebastien.Viardot@grenoble-inp.fr', password: '123456' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  let token = response.body.token
  // update User with no admin accout
  response = await request(app)
    .put('/api/users/1')
    .set('x-access-token', token)
    .send({ password: 'MyP@ssw0rd!' })
  expect(response.statusCode).toBe(403)
  expect(response.body.message).toBe('Forbidden access')

  // login with admin account
  const mail = 'Uchiha.Admin@grenoble-inp.fr'
  const password = '123456'
  response = await request(app)
    .post('/login')
    .send({ email: mail, password: password })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  token = response.body.token

  // update User with invalid password
  response = await request(app)
    .put('/api/users/1')
    .set('x-access-token', token)
    .send({ password: '111' })
  expect(response.statusCode).toBe(400)
  expect(response.body.message).toBe('Weak password!')
  // update User with invalid email
  response = await request(app)
    .put('/api/users/1')
    .set('x-access-token', token)
    .send({ email: 'kaka@mail' })
  expect(response.statusCode).toBe(400)
  expect(response.body.message).toBe('Invalid email!')
  // update User with invalid Name
  response = await request(app)
    .put('/api/users/1')
    .set('x-access-token', token)
    .send({ name: '111' })
  expect(response.statusCode).toBe(400)
  expect(response.body.message).toBe('Invalid name!')
  // update User with invalid isAdmin
  response = await request(app)
    .put('/api/users/1')
    .set('x-access-token', token)
    .send({ isAdmin: '9' })
  expect(response.statusCode).toBe(400)
  expect(response.body.message).toBe('isAdmin attribute must be 0 or 1')
  // update User with no attributes
  response = await request(app)
    .put('/api/users/3')
    .set('x-access-token', token)
  expect(response.statusCode).toBe(400)
  expect(response.body.message).toBe('You must specify the name, email, password or isAdmin')
  // update User
  response = await request(app)
    .put('/api/users/3')
    .set('x-access-token', token)
    .send({ name: 'Modified Name', email: 'Modified.email@grenoble-inp.fr', password: 'MyP@ssw0rd!', isAdmin: 1 })
  expect(response.statusCode).toBe(200)
  expect(response.body.message).toBe('User updated')
  // delete User
  response = await request(app)
    .delete('/api/users/3')
    .set('x-access-token', token)
  expect(response.statusCode).toBe(200)
  expect(response.body.message).toBe('User deleted')
  // listing all users
  response = await request(app)
    .get('/api/users')
    .set('x-access-token', token)
  expect(response.statusCode).toBe(200)
  expect(response.body.data.length).toBe(2)
})

test('user trying to use token while admin deleted him', async () => {
  const mail = 'madara@gmail.com'
  const pass = 'MyP@ssw0rd!'
  const nom = 'uchiha'
  // adding new user
  let response = await request(app)
    .post('/register')
    .send({ name: nom, email: mail, password: pass })
  expect(response.statusCode).toBe(200)
  expect(response.body.message).toBe('User Added')

  // login
  response = await request(app)
    .post('/login')
    .send({ email: mail, password: pass })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  const token = response.body.token

  // login with admin
  const mail2 = 'Uchiha.Admin@grenoble-inp.fr'
  const password2 = '123456'
  response = await request(app)
    .post('/login')
    .send({ email: mail2, password: password2 })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  const token2 = response.body.token

  // delete User
  response = await request(app)
    .delete('/api/users/4')
    .set('x-access-token', token2)
  expect(response.statusCode).toBe(200)
  expect(response.body.message).toBe('User deleted')
  // deleted user try to list members using old token
  response = await request(app)
    .get('/api/users')
    .set('x-access-token', token)
  expect(response.statusCode).toBe(403)
  expect(response.body.message).toBe('User doesnt exist')
})

test('Test if user can create a group and add/list members', async () => {
  const mail1 = 'madara2@gmail.com'
  const pass1 = 'MyP@ssw0rd!'
  const nom1 = 'uchihasecond'

  const groupName = 'Uchiha Clan'

  // adding new user
  let response = await request(app)
    .post('/register')
    .send({ name: nom1, email: mail1, password: pass1 })
  expect(response.statusCode).toBe(200)
  expect(response.body.message).toBe('User Added')

  // login
  response = await request(app)
    .post('/login')
    .send({ email: mail1, password: pass1 })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  // get token
  const token = response.body.token

  // missing name of group in attributes while trying to create a group
  response = await request(app)
    .post('/api/mygroups')
    .set('x-access-token', token)
  expect(response.statusCode).toBe(400)
  expect(response.body.message).toBe('You must specify the name of The Group')

  // creating new group
  response = await request(app)
    .post('/api/mygroups')
    .set('x-access-token', token)
    .send({ name: groupName })
  expect(response.statusCode).toBe(200)
  expect(response.body.message).toBe('Group Added')

  // get owned groups
  response = await request(app)
    .get('/api/mygroups')
    .set('x-access-token', token)
  expect(response.statusCode).toBe(200)
  expect(response.body.message).toBe('Returning Owned Groups')
  expect(response.body.data[0].name).toBe(groupName)

  // get entered groups
  response = await request(app)
    .get('/api/groupsmember')
    .set('x-access-token', token)
  expect(response.statusCode).toBe(200)
  expect(response.body.message).toBe('Entered Groups Successfully Returned')
  expect(response.body.data.length).toBe(1)

  // COMMENTED AFTER ADDING WEBSOCKETS
  // // adding a user that doesn't exist to my group
  // response = await request(app)
  //   .put('/api/mygroups/1/100')
  //   .set('x-access-token', token)
  // expect(response.statusCode).toBe(400)
  // expect(response.body.message).toBe('User doesnt exist')

  // // adding myself to my group
  // response = await request(app)
  //   .put('/api/mygroups/1/5')
  //   .set('x-access-token', token)
  // expect(response.statusCode).toBe(400)
  // expect(response.body.message).toBe('Cannot Add Yourself twice')

  // // adding member to group
  // response = await request(app)
  //   .put('/api/mygroups/1/1')
  //   .set('x-access-token', token)
  // expect(response.statusCode).toBe(200)
  // expect(response.body.message).toBe('Member Added')

  // // adding member that already exist
  // response = await request(app)
  //   .put('/api/mygroups/1/1')
  //   .set('x-access-token', token)
  // expect(response.statusCode).toBe(200)
  // expect(response.body.message).toBe('Member Already exist in Group')

  // // list members of group
  // response = await request(app)
  //   .get('/api/mygroups/1')
  //   .set('x-access-token', token)
  // expect(response.statusCode).toBe(200)
  // expect(response.body.message).toBe('Members of Group returned')
  // expect(response.body.data.length).toBe(2)

  // // removing member that doesn't exist
  // response = await request(app)
  //   .delete('/api/mygroups/1/100')
  //   .set('x-access-token', token)
  // expect(response.statusCode).toBe(400)
  // expect(response.body.message).toBe('User doesnt exist')

  // // removing myself from my own group
  // response = await request(app)
  //   .delete('/api/mygroups/1/5')
  //   .set('x-access-token', token)
  // expect(response.statusCode).toBe(400)
  // expect(response.body.message).toBe('Cannot remove Yourself from Your group')

  // // removing a member of the group
  // response = await request(app)
  //   .delete('/api/mygroups/1/1')
  //   .set('x-access-token', token)
  // expect(response.statusCode).toBe(200)
  // expect(response.body.message).toBe('Member Removed')

  // // list members of group
  // response = await request(app)
  //   .get('/api/mygroups/1')
  //   .set('x-access-token', token)
  // expect(response.statusCode).toBe(200)
  // expect(response.body.message).toBe('Members of Group returned')
  // expect(response.body.data.length).toBe(1)

  // const mail2 = 'danzo@gmail.com'
  // const password2 = 'MyP@ssw0rd!'
  // const name2 = 'uchihaSasuke'

  // // adding new user to test
  // let response2 = await request(app)
  //   .post('/register')
  //   .send({ name: name2, email: mail2, password: password2 })
  // expect(response2.statusCode).toBe(200)
  // expect(response2.body.message).toBe('User Added')

  // // login
  // response2 = await request(app)
  //   .post('/login')
  //   .send({ email: mail2, password: password2 })
  // expect(response2.statusCode).toBe(200)
  // expect(response2.body).toHaveProperty('token')

  // // get token
  // const token2 = response2.body.token

  // // creating new group
  // response2 = await request(app)
  //   .post('/api/mygroups')
  //   .set('x-access-token', token2)
  //   .send({ name: 'ShizouSasageo' })
  // expect(response2.statusCode).toBe(200)
  // expect(response2.body.message).toBe('Group Added')

  // // trying to manage group 2 using while I m not owner
  // response = await request(app)
  //   .get('/api/mygroups/2')
  //   .set('x-access-token', token)
  // expect(response.statusCode).toBe(403)
  // expect(response.body.message).toBe('FORBIDDEN ACCESS TO THIS GROUP')
})

test('Test Messages', async () => {
  // login
  const mail = 'Uchiha.Admin@grenoble-inp.fr'
  const password = '123456'
  let response = await request(app)
    .post('/login')
    .send({ email: mail, password: password })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  const token = response.body.token

  // trying to access not owned/existing group
  response = await request(app)
    .get('/api/messages/100')
    .set('x-access-token', token)
  expect(response.statusCode).toBe(403)
  expect(response.body.message).toBe('FORBIDDEN ACCESS TO THIS GROUP')

  // creating new group
  response = await request(app)
    .post('/api/mygroups')
    .set('x-access-token', token)
    .send({ name: 'Admins group' })
  expect(response.statusCode).toBe(200)
  expect(response.body.message).toBe('Group Added')

  // COMMENTED AFTER ADDING WEBSOCKETS

  // // add message without content
  // response = await request(app)
  //   .post('/api/messages/3')
  //   .set('x-access-token', token)
  // expect(response.statusCode).toBe(400)
  // expect(response.body.message).toBe('You must specify the content of the message')

  // const content = 'Message to admins'

  // // add message
  // response = await request(app)
  //   .post('/api/messages/3')
  //   .set('x-access-token', token)
  //   .send({ content: content })
  // expect(response.statusCode).toBe(200)
  // expect(response.body.message).toBe('Message Added')

  // // retrieve message
  // response = await request(app)
  //   .get('/api/messages/3')
  //   .set('x-access-token', token)
  // expect(response.statusCode).toBe(200)
  // expect(response.body.message).toBe('Returning Posted messages')
  // expect(response.body.data[0].content).toBe(content)
})
