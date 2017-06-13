console.log = application.remote.log

var i = 1e8
console.log(`worker running ${i} calculations...`);
var x = 1
while(i > 0) {
  i -= 1
  x = (x + Math.random()) % 10000
  // if (Math.random() > 0.99) console.log(new Date(), 'i:', i, x)
}
console.log('woker done! ')
