import React from 'react'
import { create as createStore } from 'zustand'
import gun from './gun.js'

const user = gun.user().recall({ sessionStorage: true })
export { user }

export const useCurrentUser = createStore(() => null)

user.on(user => {
  console.log('🔫user.on', user)
})

gun.on('auth', function(...args){
  console.log('🔫 event:auth', args)
  useCurrentUser.setState({
    publicKey: user?.is?.pub
  })
})

export function signUp(username, secret){
  user.create(username, secret, result => {
    if (result.err) throw new Error(result.err)
    console.log('signed up', result)
    setCurrentUser(username)
  })
}

export function signIn(username, secret){
  user.auth(username, secret, result => {
    if (result.err) throw new Error(result.err)
    console.log('signed in', result)
    setCurrentUser(username)
  })
}

export function setCurrentUser(username){
  const profile = { username }
  user.get('profile').put(profile, (...args) => {
    console.log('profile set', args)
    useCurrentUser.setState({
      ...profile,
      pub: user.is.pub,
    })
  })

}

export function signOut(){
  console.log('auth: signOut')
  user.leave()
  useCurrentUser.setState(false, true)
}

export function onAuthChange(handler){
  return useCurrentUser.subscribe(handler)
}
