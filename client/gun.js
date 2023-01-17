// import Gun from 'gun/gun'
// import SEA from 'gun/sea'

console.log(`GUN SERVER: ${process.env.API_SERVER}`)
const gun = Gun(`${process.env.API_SERVER}/gun`)

console.log('gun', gun)
window.gun = gun
export default gun


// export function signup(){
//   SEA
// }
const user = gun.user()
export { user }
