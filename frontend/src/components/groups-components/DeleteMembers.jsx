import { useContext, useEffect, useState } from "react"
import { AcceuilContext } from "../../contexts/AcceuilContext"
import { GroupsManagerContext } from "../../contexts/GroupsManagerContext"
import { AppContext } from "../../contexts/AppContext"
import DeleteMember from "./DeleteMember"

function DeleteMembers () {
  const { token, email, backend } = useContext(AppContext)
  const { selectedGroup } = useContext(AcceuilContext)
  const { userAdded, userDeleted } = useContext(GroupsManagerContext)
  const [deletedMembers, setDeletedMembers] = useState([])

  useEffect(() => {showMembers();}, [userAdded, userDeleted, selectedGroup])

  async function getGroupEmail () {
    try {
      const response = await fetch (
        backend+"api/mygroups/"+selectedGroup.id,
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
        const index = await data.findIndex(item => item.email === email);
        if (index !== -1) {
            await data.splice(index, 1);
        }
        return data
      } else {
        return []
      }
    } catch (error) {
      console.error("Error retrieving group's members emails", error)
      return []
    }
  }

  async function showMembers () {
    try {
      const result = await getGroupEmail();
      const components = await result.map((element, index) => <DeleteMember key={index} member={element}/>)
      setDeletedMembers(components)
    } catch (error) {
      console.error("Error while retrieving group's members", error);
    }
  }

  return (
    <>
      {(deletedMembers.length>0?
        <ul>
          {deletedMembers}
        </ul>
      :
        <span className="no-members-message">Vous êtes le seul membre dans ce groupe</span>
      )}
    </>
  )
}

export default DeleteMembers