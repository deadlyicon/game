import React from 'react'
import { create as createStore } from 'zustand'
import gun from './gun.js'

console.log({ sessionStorage: { ...sessionStorage } })
const user = gun.user()
user.recall({ sessionStorage: true })
export { user }

export const useCurrentUser = createStore(() => null)

user.on(user => {
  console.log('🔫user.on', user)
  // user.recall({ sessionStorage: true })
})

gun.on('auth', function(...args){
  console.log('🔫 event:auth', args)
  if (user.is){
    user.get('profile').once(profile => {
      console.log("PROFILE", profile)
      useCurrentUser.setState({
        ...profile,
        id: user.is.pub
      })
    })
  }else{
    useCurrentUser.setState(null)
  }
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
  if (!user.is) throw new Error(`expected to be logged in`)
  sessionStorage.pair = JSON.stringify(user._.sea)
  sessionStorage.recall = true
  const id = user.is.pub
  const profile = { id, username }
  console.log('SET PROFILE', profile)
  user.get('profile').put(profile, res => {
    if (res.err) throw new Error(res.err)
    console.log('profile set', args)
    useCurrentUser.setState(profile)
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
