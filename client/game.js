import React from 'react'
import { create as createStore } from 'zustand'
import gun from './gun.js'
import { user, onAuthChange } from './auth.js'

const NAMEPSPACE = `__game__${process.env.NODE_ENV}`
const gameGun = gun.get(NAMEPSPACE)
window.gameGun = gameGun

const usePlayers = createStore(() => ({}))
export { usePlayers }

gameGun.get('players').map().on((player, id) => {
  usePlayers.setState({
    [id]: player
  })
})

onAuthChange(loggedIn => {
  console.log('AUTH CHANGE', { loggedIn })
  if (loggedIn) onLogin()
})

if (user.is) onLogin()

function onLogin() {
  const me = gameGun.get('players').get(user.is.pub)
    .put({
      x: 0, y: 0
    })

  user.get('username').on(username => {
    me.get('username').put(username)
  })
}
