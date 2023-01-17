import Gun from 'gun/gun'

console.log(`GUN SERVER: ${process.env.API_SERVER}`)
const gun = Gun(`${process.env.API_SERVER}/gun`)

window.gun = gun

export default gun
