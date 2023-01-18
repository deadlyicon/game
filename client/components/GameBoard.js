import React from 'react'
import sortBy from 'lodash/sortBy'
import { usePlayers, useCurrentPlayer } from '../players.js'

const SIZE = 10
export default function GameBoard(){
  const players = usePlayers()
  const currentPlayer = useCurrentPlayer()
  return <div>
    <div style={{
      position: 'relative',
      width: '90vw',
      height: '90vw',
      backgroundColor: 'teal',
      margin: '0 auto',
    }}>
      {Object.values(players).map(player =>
        <div key={player.id} style={{
          backgroundColor: (
            player.id === currentPlayer.id ? 'red' : 'blue'
          ),
          position: 'absolute',
          top: `${player.y}px`,
          left: `${player.x}px`,
          height: 'min(1%, 10px)',
          width: 'min(1%, 10px)',
        }}/>
      )}
    </div>
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
