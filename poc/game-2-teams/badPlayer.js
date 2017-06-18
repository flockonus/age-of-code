var methods = application.remote
var name
methods.getPlayerName((e, n) => {
  name = n
})
console.log = methods.log

function gameStart () {
  console.log('gameStart() let\'s begin!')
  runIntensiveFunction()
}

// some ppl just wanna see the world burn ⽕⽕
function runIntensiveFunction () {
  var i = 1e9
  var x = 1
  console.log(`badWorker running ${i} calculations... (total pain in the ass)`)
  while (i > 0) {
    i -= 1
    x = (x + Math.random()) % 10000
    // if (Math.random() > 0.99) console.log(new Date(), 'i:', i, x)
  }
  console.log('badWorker done! ')
}

// register all your handlers here, and call ready
function load () {
  console.log('... my name is', name)
  application.setInterface({gameStart})
  // lastly call ready, when script is ready to go!
  methods.ready()
}

setTimeout(load, 100)
