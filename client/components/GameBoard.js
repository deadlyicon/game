import React from 'react'
import sortBy from 'lodash/sortBy'
import { usePlayers } from '../players.js'

const SIZE = 10
export default function GameBoard(){
  return <div style={{
    width: '90vw',
    height: '90vw',
    display: 'grid',
    gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
  }}>
    {Array(10).fill().map((_, x) =>
      <div key={x} style={{}}>
        {Array(10).fill().map((_, y) =>
          <div key={y} style={{
            height: '10%',
            width: '10%',
          }}>
            .
          </div>
        )}
      </div>
    )}
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
