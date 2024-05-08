import { useEffect, useState } from 'react'
import './App.css'
import { AppContext } from './contexts/AppContext'
import LoginView from './components/connect-components/LoginView'
import Acceuil from './components/connect-components/Acceuil'
import CreateAccount from './components/connect-components/CreateAccount'

function App() {
  const [token, setToken] = useState("")
  const [email, setEmail] = useState("")
  const [eventMessage, setEventMessage] = useState(null)
  const [eventAddedtoGroup, setEventAddedtoGroup] = useState(null)
  const [eventDeletedFromGroup, setEventDeletedFromGroup] = useState(null)
  const [socket] = useState(new WebSocket('ws://localhost:3000'))
  const [backend] = useState("http://localhost:3000/")

  useEffect(() => {
    socket.addEventListener('message', function(message) {
      const eventMessage = JSON.parse(message.data)
      const msg = eventMessage.data
      switch (eventMessage.event) {
        case 'pong':
          socket.send(JSON.stringify({
            event: 'ping'
          }))
          break
        case 'receivedMessage':
          setEventMessage(msg)
          break
        case 'addedToGroup':
          setEventAddedtoGroup(msg)
          break
        case 'deletedFromGroup':
          setEventDeletedFromGroup(msg)
          break
        default:
          console.log('not yet handeled')
      }
    })

    return () => {
      socket.removeEventListener('message');
    };
  }, [])

  async function verifLogin (mail, pass) {
    try {
      const response  = await fetch(
        backend+"login",
        {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: mail, password: pass })
        }
      )
      if (response.ok) {
        const data = await response.json()
        setToken(data.token)
        setEmail(mail.toLowerCase())
        socket.send(JSON.stringify({
          event: 'login',
          data: {
          token: data.token
          }
        }))
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error("Error While login:", error);
      return false
    }
  }

  async function addUser (mail, pass, name) {
    try {
      const response = await fetch(
        backend+"register",
        {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: mail, password: pass, name: name})
        }
      )
      if (response.ok) {
        setEmail(mail)
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error("Error adding user:", error)
      return false
    }
  }

  return (
    <>
      <AppContext.Provider value = {{token, email, socket, setEmail, backend, eventMessage, eventAddedtoGroup, eventDeletedFromGroup}}>
        <main>
          {(!token?
            <>
              <LoginView onValidInfo={verifLogin}/>
              <CreateAccount signUp={addUser}/>
            </>
          :
            <Acceuil/>
          )}
        </main>
      </AppContext.Provider>
    </>
  )
}

export default App
