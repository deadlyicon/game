import 'phaser'
import Sword from './sword'

enum Direction {
  Up,
  Down,
  Left,
  Right
}
export default class GameCharacter extends Phaser.GameObjects.Container {
  body: Phaser.Physics.Arcade.Body
  cursors: any
  playerDirection: Direction

  private charBody: Phaser.GameObjects.Sprite
  private charWeapon: Phaser.GameObjects.Sprite
  private currentWeapon = new Sword


  constructor(scene: Phaser.Scene, x: number, y: number, characterId: string, cursors?: Phaser.Types.Input.Keyboard.CursorKeys) {
    super(scene, x, y)

    this.charBody = scene.add.sprite(0, 0, 'player', 1)
    this.setSize(this.charBody.width, this.charBody.height) // DO THIS
    this.add(this.charBody)


    this.charWeapon = scene.physics.add.sprite(
      this.currentWeapon.positionX,
      this.currentWeapon.positionY,
      this.currentWeapon.name, 1)
    this.charWeapon.setOrigin(0, 1)
    this.charWeapon.setAngle(this.currentWeapon.angle)
    this.add(this.charWeapon)

    scene.anims.create({
      key: 'left',
      frames: scene.anims.generateFrameNumbers('player', { start: 8, end: 9 }),
      frameRate: 10,
      repeat: -1
    })
    scene.anims.create({
      key: 'right',
      frames: scene.anims.generateFrameNumbers('player', { start: 1, end: 2 }),
      frameRate: 10,
      repeat: -1
    })
    scene.anims.create({
      key: 'up',
      frames: scene.anims.generateFrameNumbers('player', { start: 11, end: 13 }),
      frameRate: 10,
      repeat: -1
    })
    scene.anims.create({
      key: 'down',
      frames: scene.anims.generateFrameNumbers('player', { start: 4, end: 6 }),
      frameRate: 10,
      repeat: -1
    })
    if (cursors) {
      cursors.up = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
      cursors.left = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
      cursors.right = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
      cursors.down = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)

      cursors.space = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    }
    scene.physics.world.enableBody(this)
    scene.add.existing(this)
    // scene.positionPlayerLabel(scene.player)


  }

  public checkMovement(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    this.body.setVelocity(0)
    // Horizontal movement
    if (cursors.left.isDown) {
      this.playerDirection = Direction.Left
      this.flipX(true, this.charWeapon)
      this.body.setVelocityX(-100)
    }
    else if (cursors.right.isDown) {
      this.playerDirection = Direction.Right
      this.flipX(false, this.charWeapon)
      this.body.setVelocityX(100)
    }

    // Vertical movement
    if (cursors.up.isDown) {
      this.body.setVelocityY(-100)
    }
    else if (cursors.down.isDown) {
      this.body.setVelocityY(100)
    }

    // Update the animation last and give left/right animations precedence over up/down animations
    if (cursors.left.isDown) {
      this.charBody.anims.play('left', true)
    }
    else if (cursors.right.isDown) {
      this.charBody.anims.play('right', true)
    }
    else if (cursors.up.isDown) {
      this.charBody.anims.play('up', true)
    }
    else if (cursors.down.isDown) {
      this.charBody.anims.play('down', true)
    }
    else {
      this.charBody.anims.stop()
    }
  }

  public checkAttack(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
      if (!this.currentWeapon.active) {
        this.currentWeapon.active = true
      }
    }

    if (this.currentWeapon.active) {
      if (this.playerDirection == Direction.Right) {
        var swingLength = this.currentWeapon.swingLength + this.currentWeapon.angle
        if (this.charWeapon.angle >= swingLength) {
          this.currentWeapon.active = false
          this.charWeapon
          this.charWeapon.setAngle(this.currentWeapon.angle)
        }
        this.charWeapon.angle += this.currentWeapon.swingRate
      } else if (this.playerDirection == Direction.Left) {
        var swingLength = -this.currentWeapon.angle - this.currentWeapon.swingLength
        if (this.charWeapon.angle <= swingLength) {
          this.currentWeapon.active = false
          this.charWeapon.setAngle(-this.currentWeapon.angle)
        }
        this.charWeapon.angle -= this.currentWeapon.swingRate
      }
    }

  }

  public flipX(flipped: boolean, flipObject: Phaser.GameObjects.Sprite) {
    if (flipped) {
      flipObject.setPosition(-this.currentWeapon.positionX, this.currentWeapon.positionY)
      flipObject.setOrigin(1, 1)
      this.currentWeapon.active ? null : flipObject.setAngle(-this.currentWeapon.angle)
    } else {
      flipObject.setPosition(this.currentWeapon.positionX, this.currentWeapon.positionY)
      flipObject.setOrigin(0, 1)
      this.currentWeapon.active ? null : flipObject.setAngle(this.currentWeapon.angle)
    }
  }
}
