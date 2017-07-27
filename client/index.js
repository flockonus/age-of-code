// Took for 1 minute to serve phaser from browserify but some require PIXI error so serve it straight

const C = {
  BULLET_SPEED: 150
}
const noop = () => 0

var p1Interface, p2Interface
var playersPendingReady = 0
var playersReady = {}

function makePlayerInterface (playerName) {
  playersReady[playerName] = false
  playersPendingReady++
  return {
    getPlayerName (cb) {
      cb(null, playerName)
    },
    // interface for the player to pass messages to app
    send (cmd, callback = noop) {
      console.log('player send:', playerName, cmd)
      try {
        playerMoves[cmd.type](Object.assign({playerName}, cmd.payload))
        // switch (cmd.type) {
        //   // TODO store all these action on an object so we dont need this `switch`
        //   case 'attack':
        //     // actually resolve the player object
        //     attack(Object.assing({playerName}, cmd.payload))
        //     break
        //   default:
        //     throw new Error('command not found for given `type`')
        // }
        callback(null, {done: true})
      } catch (err) {
        console.error(err)
        callback(err)
      }
    },
    request (args, callback = noop) {
      console.log('%c' + playerName + ' request:', 'color: blue;', args)
      callback(null, {now: new Date()})
    },
    log (...args) {
      console.log('%c' + playerName + ' log:', 'color: blue;', ...args)
    },
    error (...args) {
      console.warn('%c' + playerName + ' ERROR:', ...args)
    },
    ready () {
      console.log(playerName, 'is ready!')
      playersReady[playerName] = true
      // TODO some signal about player being ready
      playersPendingReady--
      if (playersPendingReady === 0) {
        console.log('All players ready, game about to start!')
        setTimeout(function () {
          p2Interface.remote.gameStart()
          p1Interface.remote.gameStart()
        }, 1000)
      }
    }
  }
}

// after the game is loaded, load workers and start listening to their whining
function loadWorkers () {
  p1Interface = new jailed.Plugin(location.origin + '/players/player1.js', makePlayerInterface('p1'))

  p1Interface.whenConnected(() => {
    console.log('p1 script loaded succesfully')
    p2Interface = new jailed.Plugin(location.origin + '/players/player2.js', makePlayerInterface('p2'))
    p2Interface.whenConnected(() => {
      console.log('p2 script loaded succesfully')
    })
  })
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

  // lst but not least, connect player scripts
  loadWorkers()
}

function handleAHitsB (projectileA, unitB) {
  projectileA.kill()
  unitB.damage(40)
}

function update () {
  //  As we don't need to exchange any velocities or motion we can the 'overlap' check instead of 'collide'
  game.physics.arcade.overlap(aProjectile, bGroup, handleAHitsB, null, this)

  // TODO verify if all units are dead then finish the game and declare a winner
}

// simple demo function of a supposed warrior attacking - use via console
function attack (params) {
  console.log('attack', params)
  // var {unitName, angleDegrees} = params
  // FIXME should get unit from the `player` army hash!
  var unit = warriorA

  var angleDegrees = params.angle || 0
  // TODO test cooldown if (game.time.now > bulletTime) {
  const bullet = aProjectile.getFirstExists(false)

  // https://photonstorm.github.io/phaser-ce/Phaser.Physics.Arcade.html#velocityFromAngle
  const vector = game.physics.arcade.velocityFromAngle(angleDegrees, C.BULLET_SPEED)

  if (bullet) {
    console.log('will attack:', arguments)
    bullet.reset(unit.x, unit.y)
    bullet.rotation = 90
    // arrow.rotation = game.physics.arcade.angleBetween(arrow, target);
    bullet.body.velocity.set(vector.x, vector.y)
  } else {
    console.error('could not find a live bullet!!!!')
  }
}

const playerMoves = {attack}

function render () {
    // game.debug.text("Drag the ball", 32, 32);
    // game.debug.spriteInfo(arrow, 32, 100);
}
