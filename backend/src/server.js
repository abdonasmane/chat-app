/* Pour info, ce point de départ est une adaptation de celui qui vous obtiendriez
en faisant npm create backend
issu du dépôt
<https://github.com/ChoqueCastroLD/create-backend/tree/master/src/template/js>
*/

// Load Enviroment Variables to process.env (if not present take variables defined in .env file)
require('mandatoryenv').load(['PORT'])
const { PORT } = process.env

// Instantiate an Express Application
const app = require('./app')
// Open Server on selected Port
const server = app.listen(
  PORT,
  () => console.info('Server listening on port ', PORT)
)

const WebSocket = require('ws')
const groupSockets = new Map()
const userSockets = new Map()
const wss = new WebSocket.Server({ server })

const messages = require('./controllers/messages.js')
const verify = require('./controllers/verifyPrivilegeSocket.js')
const groups = require('./controllers/groups.js')

wss.on('connection', function connection (ws) {
  // Handle messages from clients
  ws.on('message', async function incoming (message) {
    const msg = JSON.parse(message)
    let gid = -1
    let uid = -1
    switch (msg.event) {
      case 'ping': // to keep connection alive
        // please note that we didn't implement reconnection methods...
        // nothing to do here
        break
      case 'login':
        try {
          const user = await verify.verifyToken(msg.data.token)
          userSockets.set(user.id, ws)
        } catch {
          console.log('Error while adding client socket')
        }
        break
      case 'enterChat':
        await verify.verifyToken(msg.data.token)
        gid = msg.data.groupId
        if (!groupSockets.has(gid)) {
          groupSockets.set(gid, new Set())
        }
        groupSockets.get(gid).add(ws)
        break
      case 'postMessage':
        try {
          const { content, groupId, token } = msg.data
          if (content.length === 0) return
          const user = await verify.verifyToken(token)
          await verify.verifyIfMember(user, groupId)
          const newMessage = await messages.addMessage(user, groupId, content)
          // Notify all connected users in the group
          const groupSocketSet = groupSockets.get(groupId)
          // Send the message to each connected client in the group
          for (const socket of groupSocketSet) {
            if (socket !== ws) { // Exclude the sender
              socket.send(JSON.stringify({ event: 'receivedMessage', data: { ...newMessage, isMe: false } }))
            }
          }
        } catch {
          console.log('Error while adding message')
        }
        break
      case 'addMemberToGroup':
        try {
          const user = await verify.verifyToken(msg.data.token)
          gid = msg.data.groupId
          uid = msg.data.userId
          await verify.verifyIfUserIsOwner(user, gid)
          const groupName = await groups.addMember(user, gid, uid)
          const addedUserSocket = userSockets.get(uid)
          if (addedUserSocket) {
            addedUserSocket.send(JSON.stringify({ event: 'addedToGroup', data: { id: gid, name: groupName } }))
          }
        } catch {
          console.log('Error while adding member')
        }
        break
      case 'deletedMemberFromGroup':
        try {
          const user = await verify.verifyToken(msg.data.token)
          gid = msg.data.groupId
          uid = msg.data.userId
          await verify.verifyIfUserIsOwner(user, gid)
          await groups.removeMember(user, gid, uid)
          const addedUserSocket = userSockets.get(uid)
          if (addedUserSocket) {
            addedUserSocket.send(JSON.stringify({ event: 'deletedFromGroup', data: { id: gid } }))
          }
        } catch {
          console.log('Error while adding member')
        }
        break
    }
  })

  const pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ event: 'pong' })) // Send a pong message with an empty payload
    }
  }, 10000) // Send a ping every 10 seconds

  ws.on('close', () => {
    clearInterval(pingInterval)
  })
})
