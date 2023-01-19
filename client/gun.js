import Gun from 'gun'
import SEA from 'gun/sea'
import 'gun/lib/radix.js'
import 'gun/lib/radisk.js'
import 'gun/lib/store.js'
import 'gun/lib/rindexed.js'

console.log(`GUN SERVER: ${process.env.GUN_SERVER}`)
console.log(`GUN PREFIX: ${process.env.GUN_PREFIX}`)

const gun = Gun(process.env.GUN_SERVER).get(process.env.GUN_PREFIX || 'game')

window.gun = gun
export default gun


// export function signup(){
//   SEA
// }
const user = gun.user()
export { user }

export const now = () => Gun.state()
