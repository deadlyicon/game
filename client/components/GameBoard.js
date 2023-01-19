import React from 'react'
import sortBy from 'lodash/sortBy'
import { createGame } from '../game.ts'
import { usePlayers, useCurrentPlayer } from '../players.js'

export default function GameBoard(){
  const boardRef = React.useRef()
  const players = usePlayers()
  const currentPlayer = useCurrentPlayer()
  React.useEffect(
    () => {
      const board = boardRef.current
      if (!board || !currentPlayer) return
      const game = createGame({
        domNode: board,
      })
      return () => {
        game.destroy(true)
      }
    },
    [boardRef.current]
  )
  if (!currentPlayer) return
  return <div>
    <div {...{ref: boardRef}}/>
    <Players {...{players}}/>
  </div>
}


function Players({ players }){
  console.log({ players })
  const sortedPlayers = sortBy(Object.values(players), ['username'])
  return <div>
    <h5>Players: </h5>
    <ul>
      {sortedPlayers.map(player =>
        <li key={player.id}>
          <span>{`@${player.username}`}</span>
          {`:`}&nbsp;
          <span>{`x=${player.x} y=${player.y}`}</span>
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
