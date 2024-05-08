import { useContext, useState } from "react"
import { AppContext } from "../../contexts/AppContext"
import { AcceuilContext } from "../../contexts/AcceuilContext"
import { GroupsManagerContext } from "../../contexts/GroupsManagerContext"
import SelectMembers from "./SelectMembers"
import DeleteMembers from "./DeleteMembers"

function GroupsManager () {
  const {token, socket} = useContext(AppContext)
  const {selectedGroup} = useContext(AcceuilContext);
  const [optionEmails, setOptionEmails] = useState([])
  const [userAdded, setUserAdded] = useState(0)
  const [userDeleted, setUserDeleted] = useState(0)

  async function addMember () {
    try {
      const selectedUser = await document.querySelector('#select-options').value;
      const id = await optionEmails.find(user => user.email === selectedUser).id;
      await socket.send(JSON.stringify({
        event: 'addMemberToGroup',
        data: {
        userId: id,
        groupId: selectedGroup.id,
        token: token
        }
      }))
      setUserAdded(userAdded+1)
    } catch (error) {
      console.error("Error while adding user", error)
    }
  }

  return (
    <GroupsManagerContext.Provider value = {{optionEmails, setOptionEmails, userAdded, setUserAdded, userDeleted, setUserDeleted}}>
      <div className="no-members">
      <div className="box">
        <legend>Administration &quot;{selectedGroup.name}&quot;</legend>
        <div>Ajouter un membre</div>
        <div className="select-container">
          <SelectMembers/>
          <button id="select-button" onClick={addMember}>Ajouter</button>
        </div>
      </div>
      <div className="box">
        <legend>Liste Des Membres</legend>
        <div className="member-container">
          <DeleteMembers/>
        </div>
      </div>
      </div>
      
    </GroupsManagerContext.Provider>
  )
}

export default GroupsManager