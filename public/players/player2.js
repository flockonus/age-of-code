var game = application.remote
var name
game.getPlayerName((e, n) => {
  name = n
})
console.log = game.log

function gameStart () {
  console.log('gameStart() let\'s begin!')
  // setTimeout(() => {
  var startReq = Date.now()
  game.request('state', function (state) {
    console.log('got world state', Date.now() - startReq, state, 'ms')
  })
  // }, 1000)
}

// register all your handlers here, and call ready
function load () {
  console.log('... my name is', name)
  application.setInterface({gameStart})
  // lastly call ready, when script is ready to go!
  game.ready()
}

setTimeout(load, 100)
