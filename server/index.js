var browserify = require('browserify-middleware')
var express = require('express')
var app = express()
var port = 3030

// var shared = ['hyperquest', 'concat-stream'];
var shared = ['phaser-ce']
// app.get('/js/phaser.js', browserify('node_modules/phaser-ce/build/phaser.js'))
app.use('/js', browserify('./client', {external: shared}))
app.use('/vendor', express.static('node_modules/'))
app.use('/assets', express.static('assets/'))
app.use(express.static('public'))

app.listen(port)
console.log('Servig at', port)
