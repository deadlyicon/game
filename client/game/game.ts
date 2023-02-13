import 'phaser'
import { getCurrentPlayer, subPlayers } from '../state/players.js'

import tilemapPacked from 'raw:../assets/tilemap/tilemap_packed.png'
import level1 from 'raw:../assets/level1.json'
import spaceman from 'raw:../assets/sprites/spaceman.png'
import sword from 'raw:../assets/sprites/sword.png'
import GameCharacter from './player'

export function createGame({ domNode }) {
  const config = {
    parent: domNode,
    height: 640,
    width: 640,
    scene: MainScene,
    backgroundColor: '#2d2d2d',
    pixelArt: true,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 }
      }
    },
    fps: {
      target: 120,
      forceSetTimeOut: true
    },
  }
  const game = new Phaser.Game(config)
  window.game = game
  return game
}

class MainScene extends Phaser.Scene {
  debugGraphics: any
  map: any
  cursors: any
  helpText: any
  currentPlayerState: any
  otherPlayersState: any
  otherPlayers: any
  showDebug = false
  player: GameCharacter

  constructor() {
    super('MainScene')
    this.currentPlayerState = getCurrentPlayer()
    subPlayers(players => this.otherPlayersState = players)
    // TODO teardown unsub
    window.mainScene = this
  }

  preload() {
    this.load.image('tileset', tilemapPacked)
    this.load.tilemapTiledJSON('level1', level1)
    this.load.image('sword', sword)
    this.load.spritesheet('player', spaceman, { frameWidth: 16, frameHeight: 16 })
  }

  create() {
    this.map = this.make.tilemap({ key: 'level1' })
    let tileset = this.map.addTilesetImage('tinytownpack', 'tileset')

    this.map.createLayer('background', tileset, 0, 0)
    let arena = this.map.createLayer('arena', tileset, 0, 0)


    this.map.setCollisionBetween(44, 47)
    this.map.setCollisionBetween(56, 59)
    this.map.setCollisionBetween(68, 71)
    this.map.setCollisionBetween(80, 83)


    this.otherPlayers = {}
    for (const id in this.otherPlayersState) {
      this.createOtherPlayer(id, this.otherPlayersState[id])
    }

    this.debugGraphics = this.add.graphics()

    this.input.keyboard.on('keydown-C', event => {
      this.showDebug = !this.showDebug
      this.drawDebug()
    })

    this.cursors = this.input.keyboard.createCursorKeys()

    this.player = new GameCharacter(this, 150, 150, this.currentPlayerState.id, this.cursors)
    this.createPlayerLabel(this.player, this.currentPlayerState.username)
    // Set up the player to collide with the tilemap layer. Alternatively, you can manually run
    // collisions in update via: this.physics.world.collide(player, layer).
    this.physics.add.collider(this.player, arena)

    // Setup Camera
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
    this.cameras.main.startFollow(this.player)

    this.helpText = this.add.text(16, 16, this.getHelpMessage(), {
      fontSize: '18px',
    })

    this.helpText.setScrollFactor(0)
  }

  update(time: number, delta: number): void {
    for (const id in this.otherPlayersState) {
      if (this.currentPlayerState.id === id) continue
      let otherPlayer = this.otherPlayers[id]
      if (!otherPlayer) this.createOtherPlayer(id, this.otherPlayersState[id])
      otherPlayer = this.otherPlayers[id]
      if (otherPlayer) {
        const { x = 0, y = 0 } = this.otherPlayersState[id]
        otherPlayer.x = x
        otherPlayer.y = y
        this.positionPlayerLabel(otherPlayer)
      }
    }
    // TODO remove
    // for (const id in this.otherPlayers){
    //   if (!(id in this.otherPlayersState))
    // }


    this.player.checkMovement(this.cursors)
    this.player.checkAttack(this.cursors)

    this.positionPlayerLabel(this.player)

    // TODO debounce
    this.emitNewPlayerPosition()
  }

  emitNewPlayerPosition() {
    const { x, y } = this.player
    if (
      x === this.currentPlayerState.x &&
      y === this.currentPlayerState.y
    ) return
    this.currentPlayerState.setPosition({ x, y })
  }

  drawDebug() {
    this.debugGraphics.clear()

    if (this.showDebug) {
      // Pass in null for any of the style options to disable drawing that component
      this.map.renderDebug(this.debugGraphics, {
        tileColor: null, // Non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Colliding face edges
      })
    }

    // this.helpText.setTexsubPlayers(this.getHelpMessage())
  }

  getHelpMessage() {
    return 'wasd to move. space to swing.\n' +
      'c to show collidiers.'
  }

  createOtherPlayer(id, { x = 0, y = 0, username }) {
    console.log('createOtherPlayer', { id, username })
    if (this.currentPlayerState.id === id) return
    this.otherPlayers[id] = new GameCharacter(this, 150, 150, username, this.cursors)
    this.createPlayerLabel(this.otherPlayers[id], username || id)
  }

  createPlayerLabel(player, value) {
    player.label = this.add.text(player.x, player.y, value, { fontSize: '15px', color: '#fff' })
    this.positionPlayerLabel(player)
  }

  positionPlayerLabel(player) {
    player.label.x = player.x - 25
    player.label.y = player.y - 25
  }
}
