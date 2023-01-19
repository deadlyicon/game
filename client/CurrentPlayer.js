import wait from '../lib/wait.js'
import gun, { now } from './gun.js'

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

  get x(){ return this.state?.x }
  get y(){ return this.state?.y }

  async setState(changes = {}){
    this.state = await this.gun.put({
      lastUpdatedAt: now(),
      ...changes
    })
  }

  async setPosition({ x, y }){
    await this.setState({ x, y })
  }

}
