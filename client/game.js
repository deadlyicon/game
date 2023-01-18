import React from 'react'
import { create as createStore } from 'zustand'
import gun from './gun.js'

const NAMEPSPACE = `__game__v2__${process.env.NODE_ENV}`
const gameGun = gun.get(NAMEPSPACE)
export { gameGun }
window.gameGun = gameGun
