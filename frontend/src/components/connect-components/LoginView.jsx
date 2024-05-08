import { useState, useRef, useContext, useEffect } from 'react'; 
import PropTypes from 'prop-types';
import { AppContext } from '../../contexts/AppContext';
import { validPassword, validEmail } from '../../utils';

function LoginView ({ onValidInfo }) {
  const [mail,setMail] = useState("")
  const [password,setPassword] = useState("")
  const {email} = useContext(AppContext)
  const failMessage = useRef()

  useEffect(() => {
    setMail(email);
  }, [email]);

  function message () {
    const check = !mail.length && !password.length
    if (check) {
      return ""
    }
    if (!check) {
      failMessage.current.textContent = ""
    }
    let erreur = ""
    if (!validEmail(mail)) {
      erreur += "Email invalide !\n"
    }
    if (!validPassword(password)) {
      erreur += "Mot de passe invalide !\n"
    }
    return erreur
  }
  async function connect () {
    const check = mail.length && password.length
    if (message().length===0 && check) {
      const state = await onValidInfo(mail.toLowerCase(),password)
      if (!state) {
        failMessage.current.textContent = "Email ou/et Mot de passe incorrect(s) !"
      }
    }
  }
  return (
    <fieldset id='loginview' className='formular'>
      <legend>Se Connecter</legend>
      <div className="form-row">
        <label>Email</label>
        <input id='email'
          type='text'
          value={mail}
          onChange={(e)=>setMail(e.target.value)}
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
      <button onClick={connect}>OK</button>
      <div id='fail_message' ref={failMessage} style={ { color:"red" } }></div>
      <div id='error_message' style={ { color:"red" } }> {message()}</div>
    </fieldset>
  )
}

LoginView.propTypes = {
  onValidInfo: PropTypes.func.isRequired,
};

export default LoginView