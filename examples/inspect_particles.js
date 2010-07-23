var sys = require('sys');

var core = require('../lib/core');

console.log("new nucleus C_24");
var nuc = new core.Nucleus(24,12);

var a = 0;
nuc.each_nucleon(function(i, nucleon) { 
	console.log(sys.inspect(nucleon));
	a += 1;
});
console.log(a);

console.log("new p33 - 1232");
var p33 = new core.Particle('p33_0');
console.log(sys.inspect(p33));


