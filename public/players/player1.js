var game = application.remote
var name
game.getPlayerName((e, n) => {
  name = n
})
console.log = game.log

// DONT TOUCH CODE ABOVE

function loop () {
  // var startReq = Date.now()
  // console.log('gameStart() let\'s begin!')
  game.request('state', function (err, state) {
    // console.log('got world state', Date.now() - startReq, state, 'ms')
    console.log('got state:', state)
    makeAMove()
    setTimeout(loop, 300)
  })
}

function makeAMove (state) {
  console.log('decided to attack randomly')
  game.send({
    type: 'attack',
    payload: {
      unitName: '1',
      angle: Math.floor(Math.random() * 1e7) % 360
    }
  })
}

// register all your handlers here, and call ready
function load () {
  console.log('... my name is', name)
  application.setInterface({gameStart: loop})
  // lastly call ready, when script is ready to go!
  game.ready()
}

setTimeout(load, 100)
