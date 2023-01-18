import React from 'react'
import { create as createStore } from 'zustand'
import gunRoot from './gun.js'

const NAMEPSPACE = `__game__${process.env.NODE_ENV}`
const gun = gunRoot.get(NAMEPSPACE)

const useGameState = createStore(() => ({}))
gun.on(value => {
  useGameState.setState(value, true)
})
export { useGameState }

export function getCurrentPosition() {
  gun.get('players').get(d.id).put(d);
}
