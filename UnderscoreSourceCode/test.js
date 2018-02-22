const _ = require('./underscore.js');

var obj = {};
_.each([1,2,3], function(v, k, o){
	this[k] = v;
}, obj);

console.log(obj);