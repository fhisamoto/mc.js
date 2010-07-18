var sys = require('sys');
var core = require('./core');

var particles = core.PARTICLE_TABLE
for(var k in particles){
	console.log( sys.inspect(particles[k]) );	
}

