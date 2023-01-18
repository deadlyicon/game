// import React from 'react'
// import { create as createStore } from 'zustand'
// import { user, onAuthChange } from './auth.js'
//
// const usePlayers = createStore(() => ({
// const useGameState = createStore(() => ({
//   players: {},
// }))
// export { useGameState }
//
// onAuthChange(loggedIn => {
//   console.log('AUTH CHANGE', { loggedIn })
//   user.get(NAMEPSPACE).off()
//   if (loggedIn) onLogin()
// })
//
// if (user.is) onLogin()
//
// function onLogin() {
//   const gun = user.get(NAMEPSPACE)
//   window.gameStateGun = gun
//   gun.get('players').on(
//     state => {
//       console.log('GAME STATE', state)
//       useGameState.setState(state, true)
//     },
//     {
//       change: false
//     }
//   )
//   const me = gun.get('players').get(user.is.pub)
//     .put({
//       x: 0, y: 0
//     })
//
//   user.get('username').on(username => {
//     me.get('username').put(username)
//   })
// }
