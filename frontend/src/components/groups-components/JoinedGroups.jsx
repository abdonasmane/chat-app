import { useContext, useEffect, useState } from 'react'; 
import { AppContext } from '../../contexts/AppContext.jsx';
import { AcceuilContext } from '../../contexts/AcceuilContext.jsx';
import JoinedGroup from './JoinedGroup.jsx';

function JoinedGroups () {
  const {token, backend, eventAddedtoGroup, eventDeletedFromGroup} = useContext(AppContext)
  const {groupAdded, joinedGroup, setJoinedGroup} = useContext(AcceuilContext)
  const [groupComponents, setGroupComponents] = useState([]);

  useEffect(() => {
    const addMe = async () => {
      if (eventAddedtoGroup) setGroupComponents([...groupComponents, eventAddedtoGroup])
    }
    addMe()
  }, [eventAddedtoGroup])

  useEffect(() => {
    const deleteMe = async () => {
      if (eventDeletedFromGroup) {
        const update = groupComponents.filter(item => item.id !== eventDeletedFromGroup.id)
        setGroupComponents(update)
        setJoinedGroup(null)
      }
    }
    deleteMe()
  }, [eventDeletedFromGroup])

  async function getJoinedGroups () {
    try {
      const response = await fetch(
        backend+"api/groupsmember",
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
        setGroupComponents(data.data)
      } else {
        return
      }
    } catch (error) {
      console.error("Error While Retrieving Joined Groups:", error);
      return
    }
  }

  useEffect(() => {
    getJoinedGroups()
  }, [joinedGroup, groupAdded])

  function displayJoinedGroups () {
    if (groupComponents.length === 0) return <em>No groups Joined</em>;
    const sortedAlphabet = groupComponents.slice().sort((a, b) => {
      const nameA = a.name.toLowerCase()
      const nameB = b.name.toLowerCase()
      if (nameA < nameB) return -1
      if (nameA > nameB) return 1
      return 0
    })
    const result = sortedAlphabet.map((element, index) => <JoinedGroup key={index} group={element} />)

    return result
  }

  return (
    <ul>
      {displayJoinedGroups()}
    </ul>
  )
  }

  export default JoinedGroups