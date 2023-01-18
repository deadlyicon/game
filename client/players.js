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

function setCurrentPlayer(currentUser){
  console.trace('setCurrentPlayer', currentUser)
  useCurrentPlayer.setState(
    user.is ? new CurrentPlayer(currentUser) : null,
    true
  )
}

onAuthChange(currentUser => {
  console.log('AUTH CHANGE', { currentUser })
  setCurrentPlayer(currentUser)
})
// if (user.is) setCurrentPlayer()
