import React from 'react'
import { create as createStore } from 'zustand'
import gun from './gun.js'
import { user, onAuthChange } from './auth.js'

const NAMEPSPACE = `__game__${process.env.NODE_ENV}`

const usePlayers = createStore(() => ({}))
export { usePlayers }

onAuthChange(loggedIn => {
  console.log('AUTH CHANGE', { loggedIn })
  gun.get(NAMEPSPACE).off()
  gun.get(NAMEPSPACE).get('players').off()
  if (loggedIn) onLogin()
})

if (user.is) onLogin()

function onLogin() {
  const _gun = gun.get(NAMEPSPACE)
  window.gameStateGun = _gun
  _gun.get('players').map().on((player, id) => {
    usePlayers.setState({
      [id]: player
    })
  })

  const me = _gun.get('players').get(user.is.pub)
    .put({
      x: 0, y: 0
    })

  user.get('username').on(username => {
    me.get('username').put(username)
  })
}
