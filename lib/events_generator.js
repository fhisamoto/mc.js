var core = require('./core');

var EventsGenerator = function(cross_sections, actions) {
	this.calculate_cs = function(p1, p2) {
		var ret = {
			channels: {},
			total: 0.,
			b2: 0.
		};
		
		ret.b2 = (Math.pow(p2.pos[1] - p1.pos[1], 2) +  Math.pow(p2.pos[2] - p1.pos[2], 2));
		for(var k in cross_sections) {
			ret.channels[k] = cross_sections[k](p1, p2);
			ret.total += ret.channels[k];
		}
		return ret;
	}
	
	var initial_position = function(radius) {
		var r = Math.pow(Math.random(), .5) * radius;
		var theta = 2 * Math.PI * Math.random();
		var z = r * Math.cos(theta);
		var y = r * Math.sin(theta);
		var r2 = Math.pow(y, 2) + Math.pow(z, 2);
		var x = Math.sqrt( Math.pow(radius, 2) - r2 );
	
		return new core.LorentzVector([x, y, z]);
	}
	
	this.generate = function(particle, nucleus) {	
		particle.pos = initial_position(nucleus.R);
		
		var list = [];
		var calculate = this.calculate_cs;
		nucleus.each_nucleon(function(i, nucleon) {
			var k = calculate(particle, nucleon);
			if ( k.b2 < k.total ) {
				// TODO: adicionar a action correta em k.
				list.push(k);
			}
		});
		return list;
	}
};

exports.EventsGenerator = EventsGenerator;