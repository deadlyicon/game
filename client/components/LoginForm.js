import React from 'react'
import sortBy from 'lodash/sortBy'
import GameState from './GameState.js'
import { useCurrentUser, signUp, signIn, signOut } from '../auth.js'

export default function LoginForm(){
  const _signUp = event => {
    const { username, secret } = getFormValues(event)
    signUp(username, secret)
  }
  const _signIn = event => {
    const { username, secret } = getFormValues(event)
    signIn(username, secret)
  }
  const onSubmit = event => { event.preventDefault(); }
  return <form {...{onSubmit}}>
    <input name="username" type="text" placeholder="username"/>
    <input name="secret" type="password" placeholder="secret"/>
    <button type="submit" onClick={_signUp}>sign up</button>
    <button type="submit" onClick={_signIn}>sign in</button>
  </form>
}

function getFormValues(event){
  const { form } = event.target
  const formData = new FormData(form)
  return Object.fromEntries(formData.entries())
}
