var core = require('../lib/core');
var rotations = require('../lib/rotations');

var bw = function(sqrt_s, mass, gamma_0, sigma_0) { 
	var d = Math.pow( Math.pow(sqrt_s, 2) - Math.pow(mass,2), 2 ) + 
		Math.pow(mass, 2) * Math.pow(gamma_0, 2);
		return sigma_0 * (Math.pow(mass, 2) * Math.pow(gamma_0, 2)) / d; 
};

var cross_sections = {
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
		
	var cos_theta = 1. - 2. * Math.random();
	var sin_theta = Math.sqrt(1. - Math.pow(cos_theta, 2));
	var phi = Math.random() * 2 * Math.PI;	

	return new core.LorentzVector([ 
			pm * sin_theta * Math.cos(phi),
			pm * sin_theta * Math.sin(phi),
			pm * cos_theta,
			Math.sqrt(Math.pow(pm,2) + Math.pow(m1, 2))
		]);
}

var set_ressonance_mass = function(particle, sqrt_s) {
	var DELTA = 20.;
	var l_cut = particle.mass - (particle.width - DELTA);
	var alpha = Math.atan( 2. * ( l_cut - particle.mass ) / particle.width );  
	var beta  = Math.atan( 2. * ( sqrt_s - particle.mass ) / particle.width );
	particle.mass = particle.mass + .5 * particle.width * Math.tan(alpha + Math.random() * ( beta - alpha ));
}

var photon_events = {	
	one_pion: function(gamma, nucleon) {				
		var p_tot = gamma.p.add_vec(nucleon.p);
		var p_cm = rotations.lorentz_rotation(p_tot, p_tot);
		
		var particles = particles_select(nucleon);
		var k1 = calculate_pion_momentum(particles, p_cm);
		var k2 = p_cm.sub_vec(k1);

		particles[0].pos = particles[1].pos;
		particles[0].p = rotations.inverse_lorentz_rotation(p_tot, k1);
		particles[1].p = rotations.inverse_lorentz_rotation(p_tot, k2);

		return particles; 
	},
	
	p33: function(gamma, nucleon) {
		var ressonance = (nucleon.name == 'neutron')? 
			new core.Particle('p33_0', [], nucleon.pos):
			new core.Particle('p33_p', [], nucleon.pos);
			
		var p_tot = gamma.p.add_vec(nucleon.p);
		var sqrt_s = Math.sqrt(p_tot.s());
		set_ressonance_mass(ressonance, sqrt_s);
		
		var pm = Math.sqrt(Math.pow(p_tot[3], 2) - Math.pow(ressonance.mass, 2));  
	  var phi = 2. * Math.PI * Math.random();
		var theta = Math.PI * Math.random();

		ressonance.set_p([
			pm * Math.sin(theta) * Math.cos(phi),
			pm * Math.sin(theta) * Math.sin(phi),
			pm * Math.cos(theta)]);
			
		return [ressonance];
	}
};

exports.cross_sections = cross_sections;
exports.photon_events = photon_events;
