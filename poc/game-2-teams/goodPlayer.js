var methods = application.remote
var name
methods.getPlayerName((e, n) => {
  name = n
})
console.log = methods.log

function gameStart () {
  console.log('gameStart() let\'s begin!')
  // TODO write game logic here
}

// register all your handlers here, and call ready
function load () {
  console.log('... my name is', name)
  application.setInterface({gameStart})
  // lastly call ready, when script is ready to go!
  methods.ready()
}

setTimeout(load, 10)
