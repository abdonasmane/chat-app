import { useContext, useEffect, useRef, useState } from 'react'; 
import { AppContext } from '../../contexts/AppContext.jsx';
import { AcceuilContext } from '../../contexts/AcceuilContext.jsx';
import OwnedGroup from './OwnedGroup.jsx'

function OwnedGroups () {
  const {token, backend} = useContext(AppContext)
  const {groupAdded, setGroupAdded} = useContext(AcceuilContext)
  const [groupComponents, setGroupComponents] = useState([]);
  const newGroupName = useRef()

  async function addGroupe () {
    try {
      const response = await fetch(
        backend+"api/mygroups",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token
          },
          body: JSON.stringify({ name: newGroupName.current.value })
        }
      )
      if (response.ok) {
        setGroupAdded(groupAdded+1)
        newGroupName.current.value = ''
      }
    } catch (error) {
      console.error("Error While creating new Group:", error);
    }
  }

  async function getOwnedGroups () {
    try {
      const response = await fetch(
        backend+"api/mygroups",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token
          }
        }
      )
      if (response.ok) {
        const data = await response.json()
        return data.data
      } else {
        return null
      }
    } catch (error) {
      console.error("Error While Retrieving owned Groups:", error);
      return null
    }
  }

  useEffect(() => {
    async function createListOfComponents () {
      try {
        const result = await getOwnedGroups ();
        if (result !== null) {
          if (result.length > 0) {
            const components = result.map((element, index) => <OwnedGroup key={index} group={element} />)
            setGroupComponents(components)
          } else {
            setGroupComponents(<em>No groups Owned</em>)
          }
        }
      } catch (error) {
        console.error("Error While Retrieving owned Groups:", error);
      }
    }
    createListOfComponents();
    }, [groupAdded])

  return (
      <>
        <ul>
          {groupComponents}
        </ul>
        <div className='owned-add'>
          <input id='owned-input' ref={newGroupName} type="text" placeholder='Nom du nouveau groupe...'/>
          <button id="addGroup" onClick={addGroupe}>Créer</button>
        </div>
      </>
  )
  }

  export default OwnedGroups