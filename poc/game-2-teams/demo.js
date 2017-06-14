var Phaser
if (typeof require !== 'undefined') {
  Phaser = require('phaser-ce')
} else {
  Phaser = window.Phaser
}

const C = {
  BULLET_SPEED: 150
}

var game = new Phaser.Game(200, 400, Phaser.CANVAS, 'my-canvas', {preload: preload, create: create, update: update, render: render})

function preload () {
  game.load.image('archer', '/assets/archer.png')
  game.load.image('warrior', '/assets/warrior.png')
  game.load.image('bullet', '/assets/bullet.png')
}

// there will be only 2 teams: A & B
var aGroup, bGroup
// weapons of ...
var aProjectile, bProjectile

var warriorA, warriorB

function create () {
  game.stage.disableVisibilityChange = true
  game.physics.startSystem(Phaser.Physics.ARCADE)
  game.stage.backgroundColor = '#007200'

  aGroup = game.add.group()
  aGroup.enableBody = true
  aGroup.physicsBodyType = Phaser.Physics.ARCADE
  aProjectile = game.add.group()
  aProjectile.enableBody = true
  aProjectile.physicsBodyType = Phaser.Physics.ARCADE

  bGroup = game.add.group()
  bGroup.enableBody = true
  bGroup.physicsBodyType = Phaser.Physics.ARCADE
  bProjectile = game.add.group()
  bProjectile.enableBody = true
  bProjectile.physicsBodyType = Phaser.Physics.ARCADE

  // create fighters
  warriorA = aGroup.create(game.world.width / 2 - 20, (game.world.height * 0.3) + 20, 'warrior')
  warriorA.health = warriorA.maxHealth
  warriorA.anchor.setTo(0.5, 0.5)
  warriorB = bGroup.create(game.world.width / 4 - 20, (game.world.height * 0.7) - 20, 'archer')
  warriorB.health = warriorB.maxHealth
  warriorB.anchor.setTo(0.5, 0.5)

  // create projectiles A
  for (let i = 0; i < 20; i++) {
    const ammo = aProjectile.create(0, 0, 'bullet')
    ammo.anchor.setTo(0.5, 0.5)
    ammo.name = 'bullet' + i
    ammo.exists = false
    ammo.visible = false
    ammo.checkWorldBounds = true
    // https://phaser.io/examples/v2/arcade-physics/accelerate-to-pointer
    ammo.body.allowRotation = false
    ammo.events.onOutOfBounds.add((b) => b.kill(), this)
  }
  // create projectiles B
  for (let i = 0; i < 20; i++) {
    const ammo = aProjectile.create(0, 0, 'bullet')
    ammo.name = 'bullet' + i
    ammo.exists = false
    ammo.visible = false
    ammo.checkWorldBounds = true
    ammo.body.allowRotation = false
    ammo.events.onOutOfBounds.add((b) => b.kill(), this)
  }
}

function handleAHitsB (projectileA, unitB) {
  projectileA.kill()
  unitB.damage(40)
}

function update () {
    // arrow.rotation = game.physics.arcade.angleBetween(arrow, target);

    //  As we don't need to exchange any velocities or motion we can the 'overlap' check instead of 'collide'
  game.physics.arcade.overlap(aProjectile, bGroup, handleAHitsB, null, this)

  // sprite.body.velocity.x = 0
  // sprite.body.velocity.y = 0
  //
  // if (cursors.left.isDown) {
  //   sprite.body.velocity.x = -300
  // } else if (cursors.right.isDown) {
  //   sprite.body.velocity.x = 300
  // }

  // useful: sprite.rotation = game.physics.arcade.moveToPointer(sprite, 60, game.input.activePointer, 500);

  // if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
  //   fireBullet()
  // }
}

function warriorAAttack (angleDegrees) {
  angleDegrees = angleDegrees || 0
  // TODO test cooldown if (game.time.now > bulletTime) {
  const bullet = aProjectile.getFirstExists(false)

  // https://photonstorm.github.io/phaser-ce/Phaser.Physics.Arcade.html#velocityFromAngle
  const vector = game.physics.arcade.velocityFromAngle(angleDegrees, C.BULLET_SPEED)

  if (bullet) {
    bullet.reset(warriorA.x, warriorA.y)
    bullet.rotation = 90
    bullet.body.velocity.set(vector.x, vector.y)
  } else {
    console.error('could not find a live bullet!!!!')
  }
}

function render () {
    // game.debug.text("Drag the ball", 32, 32);
    // game.debug.spriteInfo(arrow, 32, 100);
}
