import React from 'react'
import { create as createStore } from 'zustand'
import gun from './gun.js'

const gunUser = gun.user()
gunUser.recall({ sessionStorage: true })

export const useLoggedIn = createStore(() => !!gun.user().is)
console.log({ useLoggedIn })

gun.on('auth', function(...args){
  console.log('🔫 event:auth', args)
  useLoggedIn.setState(!!gun.user().is)
})

export function signIn(username, secret){
  gunUser.auth(username, secret, result => {
    if (result.err) throw new Error(result.err)
    console.log('signed in', result)
    useLoggedIn.setState(true, true)
    gun.user().get('username').put(username)
    gun.user().get('publicKey').put(result.pub)
  })
}

export function signUp(username, secret){
  gunUser.create(username, secret, result => {
    if (result.err) throw new Error(result.err)
    console.log('signed up', result)
    useLoggedIn.setState(true, true)
    gun.user().get('username').put(username)
    gun.user().get('publicKey').put(result.pub)
  })
}

export function signOut(){
  console.log('auth: signOut')
  gunUser.leave()
  useLoggedIn.setState(false, true)
}

export function useCurrentUser(){
  const loggedIn = useLoggedIn()
  return loggedIn ? gun.user() : null
}
