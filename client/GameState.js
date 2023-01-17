import React from 'react'
import gun, { user } from './gun.js'
import GameState from './GameState.js'

function useGameState(){
  const [gameState, setGameState] = React.useState()
  React.useEffect(
    () => {
      const off = gun.get('game').get('state').on(setGameState)
      console.log({ off })
    },
    [user]
  )
  return gameState || {}
}

export default function App(){

  const gameState = useGameState()
  return <div>
    <h5>Game State</h5>
    <pre><code>{JSON.stringify(gameState, null, 2)}</code></pre>
  </div>
}
