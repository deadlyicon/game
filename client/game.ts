import 'phaser'
import gun from './gun.js'

export function createGame(opts = {}){
  const config = {
    ...opts,
    renderType: Phaser.CANVAS,
    scene: MainScene,
    dom: { createContainer: true },
    // type: Phaser.AUTO,
    // scale: {
    //   mode: Phaser.Scale.FIT,
    //   parent: 'game',
    //   autoCenter: Phaser.Scale.CENTER_BOTH,
    //   width: '100%',
    //   height: '100%'
    // },
    backgroundColor: '#2d2d2d',
    pixelArt: true,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 }
      }
    },
    // scene: {
    //   preload: preload,
    //   create: create,
    //   update: update
    // }
  }
  console.log('PHASE config', config)
  const game = new Phaser.Game(config);
  return game
}

class MainScene extends Phaser.Scene {
  debugGraphics: any;
  map: any;
  cursors: any;
  helpText: any;
  player: any;
  showDebug = false;

  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.image('Town', '/assets/tilemap/tilemap_packed.png');
    this.load.tilemapCSV('level1', '/assets/level1.csv')
    this.load.spritesheet('player', '/assets/sprites/spaceman.png', { frameWidth: 16, frameHeight: 16 });
  }

  create() {

    this.map = this.make.tilemap({ key: 'level1', tileWidth: 16, tileHeight: 16 });
    let tileset = this.map.addTilesetImage('Town');
    let layer = this.map.createLayer(0, tileset, 0, 0);

    this.map.setCollisionBetween(44, 47);
    this.map.setCollisionBetween(56, 59);
    this.map.setCollisionBetween(68, 71);
    this.map.setCollisionBetween(80, 83);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', { start: 8, end: 9 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { start: 1, end: 2 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('player', { start: 11, end: 13 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('player', { start: 4, end: 6 }),
      frameRate: 10,
      repeat: -1
    });

    this.player = this.physics.add.sprite(50, 100, 'player', 1);

    // Set up the player to collide with the tilemap layer. Alternatively, you can manually run
    // collisions in update via: this.physics.world.collide(player, layer).
    this.physics.add.collider(this.player, layer);

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.player);


    this.debugGraphics = this.add.graphics();

    this.input.keyboard.on('keydown-C', function (event) {
      this.showDebug = !this.showDebug;
      this.drawDebug();
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.helpText = this.add.text(16, 16, this.getHelpMessage(), {
      fontSize: '18px',
    });

    this.helpText.setScrollFactor(0);
  }

  update(time: number, delta: number): void {
    this.player.body.setVelocity(0);

    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-100);
    }
    else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(100);
    }

    // Vertical movement
    if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-100);
    }
    else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(100);
    }

    // Update the animation last and give left/right animations precedence over up/down animations
    if (this.cursors.left.isDown) {
      this.player.anims.play('left', true);
    }
    else if (this.cursors.right.isDown) {
      this.player.anims.play('right', true);
    }
    else if (this.cursors.up.isDown) {
      this.player.anims.play('up', true);
    }
    else if (this.cursors.down.isDown) {
      this.player.anims.play('down', true);
    }
    else {
      this.player.anims.stop();
    }
  }

  drawDebug() {
    this.debugGraphics.clear();

    if (this.showDebug) {
      // Pass in null for any of the style options to disable drawing that component
      this.map.renderDebug(this.debugGraphics, {
        tileColor: null, // Non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Colliding face edges
      });
    }

    this.helpText.setText(this.getHelpMessage());
  }

  getHelpMessage() {
    return 'Arrow keys to move.' +
      '\nPress "C" to toggle debug visuals: ' + (this.showDebug ? 'on' : 'off');
  }

}
