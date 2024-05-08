import { useContext, useState } from "react"
import { AppContext } from "../../contexts/AppContext"
import { AcceuilContext } from "../../contexts/AcceuilContext"
import JoinedGroups from "../groups-components/JoinedGroups"
import OwnedGroups from "../groups-components/OwnedGroups"
import GroupsManager from "../groups-components/GroupsManager"
import MessagesManager from "../messages-components/MessagesManager"


function Acceuil () {
  const {email} = useContext(AppContext)
  const [groupAdded, setGroupAdded] = useState(0)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [joinedGroup, setJoinedGroup] = useState(null)

  return (
    <AcceuilContext.Provider value = {{groupAdded, setGroupAdded, selectedGroup, setSelectedGroup, joinedGroup, setJoinedGroup}}>
      <h2><legend>Bienvenue {email} !</legend></h2>
      <div id='acceuil'>
        <div className="groups-container">
          <div className="joined-container">
            <div className="box">
              <legend style={ { textDecoration: 'underline' } }>Ceux dont je suis membre</legend>
              <JoinedGroups></JoinedGroups>
            </div>
          </div>
          <div className="owned-container">
            <div className="box">
              <legend style={ { textDecoration: 'underline' } }>Ceux que j&apos;administre</legend>
              <OwnedGroups></OwnedGroups>
            </div>
          </div>
        </div>
        <div className="group-manage">
          {(selectedGroup?
            <GroupsManager></GroupsManager>
          :
            null
          )}
        </div>
        <div className="message-manage">
          {(joinedGroup?
            <MessagesManager></MessagesManager>
          :
            null
          )}
        </div>
      </div>
    </AcceuilContext.Provider>
  )
}

export default Acceuil