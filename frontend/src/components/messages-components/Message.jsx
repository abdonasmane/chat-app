import PropTypes from 'prop-types';

function Message ({message}) {

  return (
    <>
      {(!message.isMe?
        <div className="message-container">
          <span className="message">
            {message.content}
          </span>
          <span className="poster">
            {message.userName}
          </span>
        </div>
      :
        <div className="message-container">
          <span className="message-me">
            {message.content}
          </span>
        </div>
      )}
    </>
  )
}

Message.propTypes = {
  message: PropTypes.object.isRequired,
};

export default Message