import React from 'react'
import { useCurrentUser, signOut } from './auth.js'
import LoginForm from './components/LoginForm.js'
import GameBoard from './components/GameBoard.js'

export default function App(){
  const currentUser = useCurrentUser()
  return <div>
    {currentUser
      ? <>
        <div>
          <small>user: {currentUser.is.pub}</small>
          <button onClick={signOut}>sign out</button>
        </div>
        <GameBoard/>
      </>
      : <LoginForm/>
    }
  </div>
}
