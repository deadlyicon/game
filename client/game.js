import React from 'react'
import gun from './gun.js'

const NAMEPSPACE = `__game__v3__${process.env.NODE_ENV}`
const gameGun = gun.get(NAMEPSPACE)
export { gameGun }
window.gameGun = gameGun
