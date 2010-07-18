var sys = require('sys');
var core = require('./core');

// console.log(sys.inspect(new core.Nucleus(24,12)));
var particles = core.PARTICLE_TABLE
for(var k in particles){
	console.log( sys.inspect(particles[k]) );	
}

