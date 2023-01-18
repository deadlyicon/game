import React from 'react'
import { useCurrentUser, signOut } from './auth.js'
import LoginForm from './components/LoginForm.js'
import GameBoard from './components/GameBoard.js'
import Test from './test.ts'

console.log({ Test })

export default function App(){
  const currentUser = useCurrentUser()
  console.log({ currentUser })
  return <div>
    {currentUser
      ? <>
        <div>
          <small>user: {currentUser.username}</small>
          <button onClick={signOut}>sign out</button>
        </div>
        <GameBoard/>
      </>
      : <LoginForm/>
    }
  </div>
}
