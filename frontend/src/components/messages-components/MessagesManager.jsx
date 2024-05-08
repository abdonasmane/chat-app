import { useContext, useEffect, useRef, useState } from "react"
import { AppContext } from "../../contexts/AppContext"
import { AcceuilContext } from "../../contexts/AcceuilContext"
import { MessagesManagerContext } from "../../contexts/MessagesManagerContext"
import Message from "./Message";
import PostMessage from "./PostMessage";

function MessagesManager () {
  const {token, backend, eventMessage} = useContext(AppContext)
  const {joinedGroup} = useContext(AcceuilContext)
  const [messages, setMessages] = useState([])
  const {email} = useContext(AppContext)
  const chatContainerRef = useRef(null)

  useEffect(() => {
    if (eventMessage) setMessages([...messages, eventMessage])
  }, [eventMessage])

  async function getMessages () {
    try {
      const response = await fetch (
        backend+"api/messages/"+joinedGroup.id,
        {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token
          }
        }
      )
      if (response.ok) {
        let data = await response.json()
        data = await data.data
        data = await addPostersNames(data);
        setMessages(data)
      } else {
        setMessages([])
      }
    } catch (error) {
      console.error("Error retrieving group's members messages", error)
      setMessages([])
    }
  }

  async function addPostersNames (dataMessages) {
    try {
      const response = await fetch (
        backend+"api/users/",
        {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token
          }
        }
      )
      if (response.ok) {
        let data = await response.json()
        data = await data.data
        let newMessages = []
        for (let message of dataMessages) {
          const user = data.find(user => user.id === message.userId);
          const newMessage = {
            ...message,
            userName: user.name,
            isMe: false
          }
          if (user.email === email) {newMessage.isMe = true}
          newMessages.push(newMessage);
        }
        return newMessages
      } else {
        return []
      }
    } catch (error) {
      console.error("Error retrieving posters's names", error)
      return []
    }
  }
  
  useEffect(() => {
    getMessages()
  }, [joinedGroup])

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function displayMessages () {
    const result = messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((message, index) => (<Message key={index} message={message} />))
    return result
  }

  function scrollToBottom() {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }

  return (
    <MessagesManagerContext.Provider value = {{ messages, setMessages}}>
      <div id='messagecomponent'>
      <div className="box">
      <legend>Discussion sur le groupe {joinedGroup.name}</legend>
      {(messages.length>0?
      <>
        <div ref={chatContainerRef} className="chat-container">
          <div className="messages">
            {displayMessages()}
          </div>
        </div>
        <PostMessage></PostMessage>
      </>
      :
        <>
          <span className="no-members-message">Aucun messages disponibles</span>
          <PostMessage></PostMessage>
        </>
      )}
      </div>
      </div>
    </MessagesManagerContext.Provider>
  )
}

export default MessagesManager