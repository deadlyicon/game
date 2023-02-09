import React from 'react'
import createStore from './store.js'
import gun from './gun.js'
import { user, onAuthChange } from './auth.js'
import CurrentPlayer from './CurrentPlayer.js'

const usePlayers = createStore(() => ({}))
const useCurrentPlayer = createStore(() => null)
export { usePlayers, useCurrentPlayer }
window.usePlayers = usePlayers
window.useCurrentPlayer = useCurrentPlayer

const fiveMinutesAgo = () => Date.now() - (1000 * 60 * 5)

gun.get('players').map().on((player, id) => {
  if (player.lastUpdatedAt && player.lastUpdatedAt > fiveMinutesAgo()) {
    usePlayers.setState({ [id]: { ...player, id } })
  }
})

onAuthChange(currentUser => {
  setCurrentPlayer(currentUser)
})

function setCurrentPlayer(currentUser) {
  useCurrentPlayer.setState(
    user.is ? new CurrentPlayer(currentUser) : null,
    true
  )
}

export function getCurrentPlayer() {
  return useCurrentPlayer.getState()
}

export function subPlayers(handler) {
  handler(usePlayers.getState)
  return usePlayers.subscribe(handler)
}
