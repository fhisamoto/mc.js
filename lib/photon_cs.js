var bw = function(sqrt_s, mass, gamma_0, sigma_0) { 
	var d = Math.pow( Math.pow(sqrt_s, 2) - Math.pow(mass,2), 2 ) + 
		Math.pow(mass, 2) * Math.pow(gamma_0, 2);
		return sigma_0 * (Math.pow(mass, 2) * Math.pow(gamma_0, 2)) / d; 
};

exports.cross_sections = {
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
		var e_cm = gamma.p.add_vec(nucleon.p).s() / 1000.;
		
		if (nucleon.name == 'proton')
			return bw(e_cm, 1.18146, 0.166511, 381.488);
		else if (nucleon.name == 'neutron')
			return bw(e_cm, 1.18146, 0.166511, 364.76);
	}
};

var micro_barn_to_femi_sqr = .0001 / Math.PI; 
exports.cross_sections_in_fermi = {
	one_pion: function(gamma, nucleon){
		return micro_barn_to_femi_sqr * 
			exports.cross_sections.one_pion(gamma, nucleon);
	},
	
	p33: function(gamma, nucleon) {
		return micro_barn_to_femi_sqr * 
			exports.cross_sections.p33(gamma, nucleon);
	}
};

var core = require('../lib/core');
var rotations = require('../lib/rotations');

var particles_select = function(nucleon) { 
	if (Math.random() <= 1./3.) {
		return [
			new core.Particle('pi_0'), 
			new core.Particle(nucleon.name, [], nucleon.pos)
		];
	} else {
		return (nucleon.name == 'proton') ? 
			[new core.Particle('pi_p'), new core.Particle('neutron', [], nucleon.pos)] : 
			[new core.Particle('pi_m'), new core.Particle('proton', [], nucleon.pos)];
	}
}
	
var calculate_pion_momentum = function(particles, p_cm) {
	var s = p_cm.s();
	var m1 = particles[0].mass, m2 = particles[1].mass;
	var pm = Math.sqrt(Math.pow( Math.pow(m2, 2) - s - Math.pow(m1,2), 2)/(4 * s) - 
		Math.pow(m1, 2));			
		
	var cos_theta = - 2. * Math.random();
	var sin_theta = Math.sqrt(1. - Math.pow(cos_theta, 2));
	var phi = Math.random() * 2 * Math.PI;	

	return new core.LorentzVector([ 
			pm * sin_theta * Math.cos(phi),
			pm * sin_theta * Math.sin(phi),
			pm * cos_theta,
			Math.sqrt(Math.pow(pm,2) + Math.pow(m1, 2))
		]);
}

exports.photon_events = {	
	one_pion: function(gamma, nucleon) {				
		var p_tot = gamma.p.add_vec(nucleon.p);
		var p_cm = rotations.lorentz_rotation(p_tot, p_tot);
		
		var particles = particles_select(nucleon);
		var k1 = calculate_pion_momentum(particles, p_cm);
		var k2 = pcm.sub_vec(k1);
		
		particles[0].set_p(rotations.inverse_lorentz_rotation(p_tot, k1));
		particles[1].set_p(rotations.inverse_lorentz_rotation(p_tot, k2));

		return particles; 
	},
	
	p33: function(gamma, nucleon, nucleus) {
	
	}
};
