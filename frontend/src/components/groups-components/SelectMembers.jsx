import { useContext, useEffect } from "react"
import { AcceuilContext } from "../../contexts/AcceuilContext"
import { AppContext } from "../../contexts/AppContext"
import { GroupsManagerContext } from "../../contexts/GroupsManagerContext"

function SelectMembers () {
  const {userAdded, userDeleted, optionEmails, setOptionEmails} = useContext(GroupsManagerContext)
  const {token, backend} = useContext(AppContext)
  const {selectedGroup} = useContext(AcceuilContext)

  useEffect(() => {getOptionEmails();}, [selectedGroup, userAdded, userDeleted]);


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
        return data
      } else {
        return []
      }
    } catch (error) {
      console.error("Error retrieving group's members emails", error)
      return []
    }
  }

  async function getMembersEmail () {
    try {
      const response = await fetch(
        backend+"api/users",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token
          }
        }
      )
      if (response.ok) {
        let data = await response.json()
        data = await data.data
        return data
      } else {
        return []
      }
    } catch (error) {
      console.error("Error retrieving All members emails", error)
      return []
    }
  }

  async function getOptionEmails () {
    let data = await getMembersEmail()
    let alreadyIn = await getGroupEmail()
    alreadyIn = await alreadyIn.map(member => member.email);
    const data2 = await data.filter(user => !alreadyIn.includes(user.email));
    setOptionEmails(data2)
  }

  return (
    <>
      {(optionEmails.length>0?
        <select id="select-options">
          {optionEmails.map((user, index) => (
            <option key={index} value={user.email}>{user.email}</option>
          ))}
        </select>
      :
        <span className="no-members-message">Pas de membres disponibles</span>
      )}
    </>
    
    
  )
}

export default SelectMembers