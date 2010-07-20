var core = require('./core');

var select_decay_channel = function(particle)
{
	var decays = core.PARTICLE_TABLE[particle.name].decays
	if (decays != null) {	
		var v = Math.random();
		var sum = 0.0;
		for(var i in decays) {
			sum += decays[i].ratio;
			if (v <= sum) return decays[i].products.slice();
		}
	}
	return null;
}

var decay = function(particle) {
	var products = select_decay_channel(particle);
	
}