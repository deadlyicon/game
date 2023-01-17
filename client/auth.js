import React from 'react'
import { create as createStore } from 'zustand'
import gun from './gun.js'

const gunUser = gun.user()
gunUser.recall({ sessionStorage: true })

const useAuth = createStore(set => ({
  // currentUser: gunUser.is
}))

gun.on('auth', function(...args){
  console.log('🔫 event:auth', args)
  useAuth.setState({ currentUser: gunUser.is })
  // gunUser.get('said').set('i logged in')
  //
  // gunUser.get('said').map().once((say, id) => {
  //   console.log({ user, say, id })
  // })
  // $('#sign').hide();
  // user.get('said').map().once(UI);
})


export function signIn(username, secret){
  gunUser.auth(username, secret)
}

export function signUp(username, secret){
  gunUser.create(username, secret, (...args) => {
    console.log('new user', args)
  })
}

export function signOut(){
  console.log('auth: signOut')
  gunUser.leave()
  useAuth.setState({}, true)
}

export function useCurrentUser() {
  const authState = useAuth()
  console.log('useCurrentUser', authState)
  return authState.currentUser
  // const forceUpdate = React.useState()[1]
  // React.useEffect(
  //   () => {
  //     let sub
  //     gun.on('auth', (value, key, _msg, _sub) => {
  //       console.log('🔫 event:auth useCurrentUser', { value, key, _msg, _sub })
  //       sub = _sub
  //       debugger
  //       forceUpdate({})
  //     })
  //     return () => { if (sub) sub.off() }
  //   },
  //   []
  // )
  // console.log('useCurrentUser', gunUser.is)
  // return gunUser.is ? gunUser.is : null
}
