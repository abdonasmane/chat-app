import { useContext, useRef } from "react"
import { AcceuilContext } from "../../contexts/AcceuilContext"
import { AppContext } from "../../contexts/AppContext"
import { MessagesManagerContext } from "../../contexts/MessagesManagerContext"

function PostMessage () {
  const {token, socket} = useContext(AppContext)
  const {joinedGroup} = useContext(AcceuilContext)
  const message = useRef()
  const { messages, setMessages} = useContext(MessagesManagerContext)

  async function postMessage () {
    try {
      const messageContent = message.current.value
      if (!messageContent.trim()) return;
      await socket.send(JSON.stringify({
        event: 'postMessage',
        data: {
        content: messageContent,
        groupId: joinedGroup.id,
        token: token
        }
      }))
      message.current.value = ''
      setMessages([...messages, {content: messageContent, isMe: true, createdAt: new Date()}]);
    } catch (error) {
      console.error("Error While adding message:", error);
      return
    }
  }

  return (
    <div className="message-input-container">
      <input id='message-input' ref={message} type="text" placeholder='Ecrivez votre message...'/>
      <button id="post-message" onClick={postMessage}>Envoyer</button>
    </div>
  )
}


export default PostMessage