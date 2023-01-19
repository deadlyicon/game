import wait from '../lib/wait.js'
import gun from './gun.js'

export default class CurrentPlayer {
  constructor({ id, username }) {
    this.id = id
    this.username = username
    this.gun = gun.get('players').get(id)
    console.log('CurrentPlayer#constructor', this)
    this.ready = this.init().catch(error => {
      console.error('CurrentPlayer failed to init', error)
      this.broken = error
    })
    // this.reload().catch(error => {
    //   console.error('CurrentPlayer#constructor reload error', error)
    // })
  }

  async init(){
    if (this.ready) return
    console.log('CurrentPlayer init')
    console.log('CurrentPlayer loading player state')
    this.state = await Promise.race([
      this.gun.then(),
      wait(1000),
    ])
    console.log('CurrentPlayer loaded player state')
    if (!this.state) {
      console.log('CurrentPlayer initialzing state')
      const { id, username } = this
      this.state = { id, username, x: 0, y: 0 }
      await this.gun.put(this.state).then()
    }
    this._onStateChange = this._onStateChange.bind(this)
    this.gun.on(this._onStateChange)
  }
  _onStateChange(state){
    this.state = state
  }
  get x(){ return this.state.x }
  get y(){ return this.state.y }

  async setState(changes){
    this.state = await this.gun.put(changes)
  }

  async setPosition({ x, y }){
    await this.setState({ x, y })
  }

  // async reload(){
  //   await this.gun.once(state => {
  //     if (!state || !state.username) debugger
  //     this.state = state
  //     console.log('CurrentPlayer#constructor loaded player', this, {state})
  //   }).then()
  // }

  // async move(direction){
  //   await this.ready
  //   console.log('MOVING', this)
  //   let { x = 0, y = 0 } = this.state
  //   if (direction === 'up') await this.setState({ y: Math.max(y - 1, 0) })
  //   if (direction === 'down') await this.setState({ y: Math.min(y + 1, 100) })
  //   if (direction === 'left') await this.setState({ x: Math.max(x - 1, 0) })
  //   if (direction === 'right') await this.setState({ x: Math.min(x + 1, 100) })
  //   console.log('moved', this)
  // }
}
