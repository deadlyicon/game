import React from 'react'
import { create as createStore } from 'zustand'
import { gameGun } from './game.js'
import { user, onAuthChange } from './auth.js'

const usePlayers = createStore(() => ({}))
export { usePlayers }

gameGun.get('players').map().on((player, id) => {
  if (!player || !player.username) return
  console.log('player', player)
  usePlayers.setState({
    [id]: player
  })
})

let interval
onAuthChange(currentUser => {
  console.log('AUTH CHANGE', { currentUser })
  clearInterval(interval)
  if (currentUser) initPlayerMe(currentUser)
})

if (user.is) initPlayerMe()

function initPlayerMe(currentUser) {
  const me = gameGun.get('players').get(user.is.pub)

  let x = 0, y = 0
  interval = setInterval(() => {
    me.put({
      ...currentUser,
      x: x++,
      y: y++,
    })
  }, 2000)
}
