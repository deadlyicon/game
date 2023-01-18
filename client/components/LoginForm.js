import React from 'react'
import { signUp, signIn } from '../auth.js'

export default function LoginForm(){
  const _signUp = event => {
    const { username, secret } = getFormValues(event)
    signUp(username, secret)
  }
  const _signIn = event => {
    const { username, secret } = getFormValues(event)
    signIn(username, secret)
  }
  const justGO = () => {
    signUp(crypto.randomUUID(), crypto.randomUUID())
  }
  const onSubmit = event => { event.preventDefault(); }
  return <form {...{onSubmit}}>
    <input name="username" type="text" placeholder="username"/>
    <input name="secret" type="password" placeholder="secret"/>
    <button type="submit" onClick={_signUp}>sign up</button>
    <button type="submit" onClick={_signIn}>sign in</button>
    <button type="submit" onClick={justGO}>LET ME IN</button>
  </form>
}

function getFormValues(event){
  const { form } = event.target
  const formData = new FormData(form)
  return Object.fromEntries(formData.entries())
}
