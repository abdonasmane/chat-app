import { useContext } from 'react'
import PropTypes from 'prop-types'
import { AcceuilContext } from '../../contexts/AcceuilContext'
import { AppContext } from '../../contexts/AppContext'
import { GroupsManagerContext } from '../../contexts/GroupsManagerContext'

function DeleteMember ({member}) {
  const { token, socket } = useContext(AppContext)
  const { selectedGroup } = useContext(AcceuilContext)
  const { userDeleted, setUserDeleted } = useContext(GroupsManagerContext)

  async function deleteMember () {
    try {
      const id = member.id;
      await socket.send(JSON.stringify({
        event: 'deletedMemberFromGroup',
        data: {
        userId: id,
        groupId: selectedGroup.id,
        token: token
        }
      }))
      setUserDeleted(userDeleted+1)
    } catch (error) {
      console.error("Error while deleting user", error)
    }
  }

  return (
    <li className="joined-members">
      <div className="joined-delete">
        <span className="joined-email">{member.email}</span>
        <button onClick={deleteMember} className="delete-button">Supprimer</button>
      </div>
    </li>
  )
}

DeleteMember.propTypes = {
  member: PropTypes.object.isRequired,
};

export default DeleteMember