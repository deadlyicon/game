import React from 'react'
import sortBy from 'lodash/sortBy'
import { usePlayers } from '../players.js'

export default function GameBoard(){
  return <div>
    <Players/>
  </div>
}

function Players(){
  const players = usePlayers()
  const sortedPlayers = sortBy(
    Object.entries(players)
      .map(([id, player]) => ({...player, id})),
    ['username']
  )
  return <div>
    <h5>Players: </h5>
    <ul>
      {sortedPlayers.map(({id, username, x, y}) =>
        <li key={id}>
          <span>{`@${username}`}</span>
          {`:`}&nbsp;
          <span>{`x=${x} y=${y}`}</span>
        </li>
      )}
    </ul>
    {/*<pre><code>{JSON.stringify(players, null, 2)}</code></pre>*/}
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
