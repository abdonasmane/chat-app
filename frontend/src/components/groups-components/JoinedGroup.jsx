import { useContext, useRef } from 'react'
import { AcceuilContext } from '../../contexts/AcceuilContext'
import PropTypes from 'prop-types'
import { AppContext } from '../../contexts/AppContext'

function JoinedGroup ({group}) {
  const {token, socket} = useContext(AppContext)
  const {setJoinedGroup, setSelectedGroup} = useContext(AcceuilContext)
  const liRef = useRef()

  async function handleClick () {
    if (liRef.current.className === 'joined-group') {
      liRef.current.classList.remove('joined-group')
      setJoinedGroup(null)
      return
    }
    const alreadySelected = document.querySelector('.joined-group')
    const ownedSelected = document.querySelector('.selected-group')
    if (alreadySelected) {
      alreadySelected.classList.remove('joined-group')
    }
    if (ownedSelected) {
      ownedSelected.classList.remove('selected-group')
    }
    liRef.current.className = 'joined-group'
    setJoinedGroup(group)
    setSelectedGroup(null)
    await socket.send(JSON.stringify({
      event: 'enterChat',
      data : {
        groupId: group.id,
        token: token
      }
    }))
  }

  return (
    <li className='cursor-on' ref={liRef} onClick={handleClick}>
      {group.name}
    </li>
  )
}

JoinedGroup.propTypes = {
  group: PropTypes.object.isRequired,
};

export default JoinedGroup