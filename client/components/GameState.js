import React from 'react'
import { useGameState } from '../game.js'

export default function GameState(){
  const gameState = useGameState()
  return <div style={{border: '1px dotted black'}}>
    <h5>Game State</h5>
    <pre><code>{JSON.stringify(gameState, null, 2)}</code></pre>
  </div>
}
