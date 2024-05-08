import { useContext, useRef } from 'react'
import PropTypes from 'prop-types'
import { AcceuilContext } from '../../contexts/AcceuilContext'

function OwnedGroup ({group}) {
  const {setSelectedGroup, setJoinedGroup} = useContext(AcceuilContext)
  const liRef = useRef()

  async function handleClick () {
    if (liRef.current.className === 'selected-group') {
      liRef.current.classList.remove('selected-group')
      setSelectedGroup(null)
      return
    }
    const alreadySelected = document.querySelector('.selected-group')
    const joinedSelected = document.querySelector('.joined-group')
    if (alreadySelected) {
      alreadySelected.classList.remove('selected-group')
    }
    if (joinedSelected) {
      joinedSelected.classList.remove('joined-group')
    }
    liRef.current.className = 'selected-group'
    setSelectedGroup(group)
    setJoinedGroup(null)
  }

  return (
    <li className='cursor-on' ref={liRef} onClick={handleClick}>
      {group.name}
    </li>
  )
}

OwnedGroup.propTypes = {
  group: PropTypes.object.isRequired,
};

export default OwnedGroup