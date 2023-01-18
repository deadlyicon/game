import React from 'react'
import sortBy from 'lodash/sortBy'
import { usePlayers, useCurrentPlayer } from '../players.js'

export default function GameBoard(){
  const boardRef = React.useRef()
  const players = usePlayers()
  const currentPlayer = useCurrentPlayer()
  React.useEffect(
    () => {
      const board = boardRef.current
      if (board) board.focus()
    },
    [boardRef.current]
  )
  console.log({ currentPlayer })
  if (!currentPlayer) return
  return <div>
    <div {...{
      ref: boardRef,
      tabIndex: 0, // make focusable
      onKeyDown(event){
        console.log('key down', event.key, event.keyCode)
        const keymap ={
          'w': () => currentPlayer.move('up'),
          'a': () => currentPlayer.move('left'),
          's': () => currentPlayer.move('down'),
          'd': () => currentPlayer.move('right'),
          'ArrowUp': () => currentPlayer.move('up'),
        }
        if (event.key in keymap) {
          event.preventDefault()
          keymap[event.key]()
        }
      },
      style: {
        position: 'relative',
        width: 'min(90vw, 90vh)',
        height: 'min(90vw, 90vh)',
        backgroundColor: 'teal',
        margin: '0 auto',
      }
    }}>
      {Object.values(players).map(player =>
        <div key={player.id} style={{
          backgroundColor: (
            player.id === currentPlayer.id ? 'red' : 'blue'
          ),
          position: 'absolute',
          top: `${player.y}%`,
          left: `${player.x}%`,
          height: 'min(1%, 10px)',
          width: 'min(1%, 10px)',
        }}/>
      )}
    </div>
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
