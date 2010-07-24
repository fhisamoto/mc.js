var sys = require('sys');
var core = require('../lib/core');

console.log("new nucleus C_24");
var nuc = core.NucleusBuilder(24,12);

var a = 0;
nuc.each_nucleon(function(nucleon) {
	console.log("name:" + nucleon.name);
	console.log("p:" + nucleon.p)
	console.log("pos:" + nucleon.pos);
	console.log("");
	a += 1;
});
console.log("nucleons: " + a);

console.log("inspect p33 - 1232");
var p33 = new core.Particle('p33_0');
console.log(sys.inspect(p33));


