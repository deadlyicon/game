import React from 'react'
import createStore from './store.js'
import gun from './gun.js'

const user = gun.user()
user.recall({ sessionStorage: true })
export { user }

export const useCurrentUser = createStore(() => null)
window.useCurrentUser = useCurrentUser
if (user.is) setCurrentUser()

async function getUserProfile(){
  gun.get('profiles').get()
}

gun.on('auth', function(...args){
  if (user.is) setCurrentUser()
  else useCurrentUser.setState(null)
})

export function signUp(username, secret){
  user.create(username, secret, result => {
    if (result.err) throw new Error(result.err)
    gun.get('usernames').get(user.is.pub).put(username)
    setCurrentUser()
  })
}

export function signIn(username, secret){
  user.auth(username, secret, result => {
    if (result.err) throw new Error(result.err)
    setCurrentUser()
  })
}

export function setCurrentUser(){
  if (!user.is) throw new Error(`expected to be logged in`)
  const id = user.is.pub
  sessionStorage.pair = JSON.stringify(user._.sea)
  sessionStorage.recall = true
  gun.get('usernames').get(id).then(
    username => {
      const cu = useCurrentUser.getState()
      if (!cu || cu.id !== id || cu.username !== username)
        useCurrentUser.setState({ id, username })
    },
    error => {
      console.error(error)
      throw error
    }
  )
}

export function signOut(){
  user.leave()
  useCurrentUser.setState(null, true)
}

export function onAuthChange(handler){
  return useCurrentUser.subscribe(handler)
}
