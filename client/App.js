import React from 'react'
import sortBy from 'lodash/sortBy'
import { useCurrentUser, signOut } from './auth.js'
import GameState from './components/GameState.js'
import LoginForm from './components/LoginForm.js'

export default function App(){
  const currentUser = useCurrentUser()
  return <div>
    <h4>APP</h4>
    <GameState/>
    {currentUser
      ? <CurrentUser/>
      : <LoginForm/>
    }
  </div>
}

function CurrentUser() {
  const currentUser = useCurrentUser()
  return <div>
    <pre>Public Key = {currentUser.is.pub}</pre>
    <button onClick={signOut}>sign out</button>
  </div>
}
