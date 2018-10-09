const ee = require('./EventEmitter');
ee.on('test', function(e) {
  console.log(e.event);
})
ee.emit('test', 1, 2, 1);