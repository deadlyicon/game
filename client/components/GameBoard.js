import React from 'react'
import { usePlayers } from '../game.js'

export default function GameBoard(){
  return <div>
    <Players/>
  </div>
}

function Players(){
  const players = usePlayers()
  console.log('Players', { players })
  return <div>
    <h5>Players: </h5>
    <pre><code>{JSON.stringify(players, null, 2)}</code></pre>
  </div>
}
//
// function GameState(){
//   const gameState = useGameState()
//   return <div style={{border: '1px dotted black'}}>
//     <h5>Game State: </h5>
//     <pre><code>{JSON.stringify(gameState, null, 2)}</code></pre>
//   </div>
// }

//
// function CurrentUser() {
//   const currentUser = useCurrentUser()
//   return <div>
//     <pre>Public Key = {currentUser.is.pub}</pre>
//     <button onClick={signOut}>sign out</button>
//   </div>
// }
