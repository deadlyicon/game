import React from 'react'
import { create as createStore } from 'zustand'
import gun from './gun.js'

const user = gun.user()
user.recall({ sessionStorage: true })
export { user }

export const useLoggedIn = createStore(() => !!gun.user().is)
console.log({ useLoggedIn })

gun.on('auth', function(...args){
  console.log('🔫 event:auth', args)
  useLoggedIn.setState(!!gun.user().is)
})

export function signIn(username, secret){
  user.auth(username, secret, result => {
    if (result.err) throw new Error(result.err)
    console.log('signed in', result)
    useLoggedIn.setState(true, true)
    gun.user().get('username').put(username)
    gun.user().get('publicKey').put(result.pub)
  })
}

export function signUp(username, secret){
  user.create(username, secret, result => {
    if (result.err) throw new Error(result.err)
    console.log('signed up', result)
    useLoggedIn.setState(true, true)
    gun.user().get('username').put(username)
    gun.user().get('publicKey').put(result.pub)
  })
}

export function signOut(){
  console.log('auth: signOut')
  user.leave()
  useLoggedIn.setState(false, true)
}

export function useCurrentUser(){
  const loggedIn = useLoggedIn()
  return loggedIn ? gun.user() : null
}

export function onAuthChange(handler){
  return useLoggedIn.subscribe(loggedIn => {
    handler(loggedIn, gun.user())
  })
}
