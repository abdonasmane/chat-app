import { useRef, useState } from 'react'; 
import PropTypes from 'prop-types';
import { validPassword, validEmail, validName } from '../../utils';


function CreateAccount ({ signUp }) {
  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [confirmedPassword,setConfirmedPassword] = useState("")
  const successMessage = useRef()
  
  function message () {
    const check = !name.length && !email.length && !password.length && !confirmedPassword.length
    if (check) {
      return ""
    }
    if (!check) {
      successMessage.current.textContent = ""
    }
    let erreur = ""
    if (!validName(name)) {
      erreur += "Nom invalide !\n"
    }
    if (!validEmail(email)) {
      erreur += "Email invalide !\n"
    }
    if (!validPassword(password)) {
      erreur += "Mot de passe invalide !\n"
    }
    if (confirmedPassword !== password) {
      erreur += "Revérifiez votre Mot de Passe !\n"
    }
    return erreur
  }
  async function connect () {
    const check = name.length && email.length && password.length && confirmedPassword.length
    if (message().length===0 && check) {
      const state = await signUp(email.toLowerCase(),password, name)
      if (state) {
        setName('')
        setEmail('')
        setPassword('')
        setConfirmedPassword('')
        successMessage.current.style.color = 'green'
        successMessage.current.textContent = 'Compte créé avec succès !'
      } else {
        successMessage.current.style.color = 'red'
        successMessage.current.textContent = 'Échec de la création du compte'
      }
    }
  }
  return (
    <fieldset id='createaccount' className='formular'>
      <legend>Pas encore de compte Enregistrez vous</legend>
      <div className="form-row">
        <label>Nom</label>
        <input id='name'
          type='text'
          value={name}
          onChange={(e)=>setName(e.target.value)}
          placeholder='Entrer votre nom ...'
        />
      </div>
      <div className="form-row">
        <label>Email</label>
        <input id='email'
          type='text'
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          placeholder='Entrer votre email ...'
        />
      </div>
      <div className="form-row">
        <label>Mot de Passe</label>
        <input id='password'
          type='password'
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          placeholder='Entrer votre mot de passe ...'
        />
      </div>
      <div className="form-row">
        <label>Comfirmez votre Mot de Passe</label>
        <input id='comfirm_password'
          type='password'
          value={confirmedPassword}
          onChange={(e)=>setConfirmedPassword(e.target.value)}
          placeholder='Confirmer votre mot de passe ...'
        />
      </div>
      <button onClick={connect}>OK</button>
      <div id='error_message' style={ { color:"red" } }> {message()}</div>
      <div id='success_message' ref={successMessage} style={ { color:"green" } }></div>
    </fieldset>
  )
}

CreateAccount.propTypes = {
  signUp: PropTypes.func.isRequired,
};


export default CreateAccount