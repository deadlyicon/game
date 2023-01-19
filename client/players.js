import React from 'react'
import { create as createStore } from 'zustand'
import gun from './gun.js'
import { user, onAuthChange, useCurrentUser } from './auth.js'
import CurrentPlayer from './CurrentPlayer.js'

const usePlayers = createStore(() => ({}))
const useCurrentPlayer = createStore(() => null)
export { usePlayers, useCurrentPlayer }
window.usePlayers = usePlayers
window.useCurrentPlayer = useCurrentPlayer

gun.get('players').map().on((player, id) => {
  usePlayers.setState({
    [id]: { ...player, id }
  })
})

onAuthChange(currentUser => {
  setCurrentPlayer(currentUser)
})

function setCurrentPlayer(currentUser){
  useCurrentPlayer.setState(
    user.is ? new CurrentPlayer(currentUser) : null,
    true
  )
}

export function getCurrentPlayer(){
  return useCurrentPlayer.getState()
}

export function subPlayers(handler){
  handler(usePlayers.getState)
  return usePlayers.subscribe(handler)
}
