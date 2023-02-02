import 'phaser'
import gun from './gun.js'
import { getCurrentPlayer, subPlayers } from './players.js'

import tilemapPacked from 'raw:./assets/tilemap/tilemap_packed.png'
import level1Arena from 'raw:./assets/level1_arena.csv'
import level1Background from 'raw:./assets/level1_background.csv'
import spaceman from 'raw:./assets/sprites/spaceman.png'
import sword from 'raw:./assets/sprites/sword.png'

export function createGame({ domNode }) {
  const config = {
    parent: domNode,
    height: 320,
    width: 320,
    scene: MainScene,
    backgroundColor: '#2d2d2d',
    pixelArt: true,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 }
      }
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
  player: any
  currentPlayerState: any
  otherPlayersState: any
  otherPlayers: any
  showDebug = false

  constructor() {
    super('MainScene')
    this.currentPlayerState = getCurrentPlayer()
    subPlayers(players => this.otherPlayersState = players)
    // TODO teardown unsub
    window.mainScene = this
  }

  preload() {
    this.load.image('Town', tilemapPacked)
    this.load.image('sword', sword)
    this.load.tilemapCSV('level1_arena', level1Arena)
    this.load.tilemapCSV('level1_bg', level1Background)
    this.load.spritesheet('player', spaceman, { frameWidth: 16, frameHeight: 16 })
  }

  create() {
    this.map = this.make.tilemap({ key: 'level1_bg', tileWidth: 16, tileHeight: 16 })
    this.map = this.make.tilemap({ key: 'level1_arena', tileWidth: 16, tileHeight: 16 })
    let tileset = this.map.addTilesetImage('Town')
    let layer = this.map.createLayer(0, tileset, 0, 0)

    this.map.setCollisionBetween(44, 47)
    this.map.setCollisionBetween(56, 59)
    this.map.setCollisionBetween(68, 71)
    this.map.setCollisionBetween(80, 83)

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', { start: 8, end: 9 }),
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { start: 1, end: 2 }),
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('player', { start: 11, end: 13 }),
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('player', { start: 4, end: 6 }),
      frameRate: 10,
      repeat: -1
    })

    this.player = this.physics.add.sprite(
      this.currentPlayerState.x || 100,
      this.currentPlayerState.y || 100,
      'player',
      1
    )
    this.createPlayerLabel(this.player, this.currentPlayerState.username || 'you')

    this.otherPlayers = {}
    for (const id in this.otherPlayersState) {
      this.createOtherPlayer(id, this.otherPlayersState[id])
    }

    // Set up the player to collide with the tilemap layer. Alternatively, you can manually run
    // collisions in update via: this.physics.world.collide(player, layer).
    this.physics.add.collider(this.player, layer)

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
    this.cameras.main.startFollow(this.player)


    this.debugGraphics = this.add.graphics()

    this.input.keyboard.on('keydown-C', event => {
      this.showDebug = !this.showDebug
      this.drawDebug()
    })

    this.cursors = this.input.keyboard.createCursorKeys()
    this.cursors.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    this.cursors.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.cursors.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    this.cursors.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)

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


    this.player.body.setVelocity(0)

    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-100)
    }
    else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(100)
    }

    // Vertical movement
    if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-100)
    }
    else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(100)
    }

    // Update the animation last and give left/right animations precedence over up/down animations
    if (this.cursors.left.isDown) {
      this.player.anims.play('left', true)
    }
    else if (this.cursors.right.isDown) {
      this.player.anims.play('right', true)
    }
    else if (this.cursors.up.isDown) {
      this.player.anims.play('up', true)
    }
    else if (this.cursors.down.isDown) {
      this.player.anims.play('down', true)
    }
    else {
      this.player.anims.stop()
    }

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

    this.helpText.setTexsubPlayerst(this.getHelpMessage())
  }

  getHelpMessage() {
    return 'Arrow wasd to move.' +
      '\nPress "C" to toggle debug visuals: ' + (this.showDebug ? 'on' : 'off')
  }

  createOtherPlayer(id, { x = 0, y = 0, username }) {
    console.log('createOtherPlayer', { id, username })
    if (this.currentPlayerState.id === id) return
    this.otherPlayers[id] = this.physics.add.sprite(x, y, 'player', 1)
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
