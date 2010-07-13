var photon_cross_sections = {
	one_pion: function(gamma, nucleon) {   
		// the energy in GeV
	  	var omega = gamma.p[3] / 1000.;  
	  	if (( omega - 0.139 ) < 0) return 0.; 		
		var x = - 2 * ( omega - 0.139 );
		if (nucleon.name == 'proton'){
			var bp1 = 91.0; 
		  	var bp2 = 71.4;
			return ( bp1 + bp2 / Math.sqrt(omega) ) * ( 1. - Math.exp(x) );  
		}
	  	if (nucleon.name == 'neutron') {
	  		var bn1 = 87.;
	  		var bn2 = 65.;  
	    	return ( bn1 + bn2 / Math.sqrt(omega) ) * ( 1. - Math.exp(x) ); 
		}
	  	return 0.; 
	},
	
	p33: function(gamma, nucleon) {
		var bw = function(sqrt_s, mass, gamma_0, sigma_0) { 
			var d = Math.pow( Math.pow(sqrt_s, 2) - Math.pow(mass,2), 2 ) + Math.pow(mass, 2) * Math.pow(gamma_0, 2);
	  		return sigma_0 * (Math.pow(mass, 2) * Math.pow(gamma_0, 2)) / d; 
		};
		
		var e_cm = Math.sqrt(s_cm(gamma.p, nucleon.p)) / 1000.;
		if (nucleon.name == 'proton')
			return bw(e_cm, 1.18146, 0.166511, 381.488);
		else if (nucleon.name == 'neutron')
			return bw(e_cm, 1.18146, 0.166511, 364.76);
	}
};

function EventsGenerator(cross_sections) {
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
	
		return [x, y, z];
	}
	
	this.generate = function(particle, nucleus) {
		
		particle.pos = initial_position(nucleus.R);
		
		var list = [];
		var calculate = this.calculate_cs;
		nucleus.each_nucleon(function(i, nucleon) {
			var k = calculate(particle, nucleon);
			if ( k.b2 * Math.PI < k.total * .0001 ) {
				list.push(k);
			}
		});
		return list;
	}
};
