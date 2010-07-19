exports.photon_cross_sections = {
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
			var d = Math.pow( Math.pow(sqrt_s, 2) - Math.pow(mass,2), 2 ) + 
				Math.pow(mass, 2) * Math.pow(gamma_0, 2);
	  		return sigma_0 * (Math.pow(mass, 2) * Math.pow(gamma_0, 2)) / d; 
		};
		
		var e_cm = Math.sqrt(s_cm(gamma.p, nucleon.p)) / 1000.;
		if (nucleon.name == 'proton')
			return bw(e_cm, 1.18146, 0.166511, 381.488);
		else if (nucleon.name == 'neutron')
			return bw(e_cm, 1.18146, 0.166511, 364.76);
	}
};

var micro_barn_to_femi_sqr = .0001 / Math.PI; 

exports.photon_cross_sections_in_fermi = {
	
	one_pion: function(gamma, nucleon){
		return micro_barn_to_femi_sqr * 
			exports.photon_cross_sections.one_pion(gamma, nucleon);
	},
	
	p33: function(gamma, nucleon) {
		return micro_barn_to_femi_sqr * 
			exports.photon_cross_sections.p33(gamma, nucleon);
	}
};

exports.photon_events = {
	
	one_pion: function(gamma, nucleon, nucleus) {
		var p_total = add_vec(gamma.p, nucleon.p);
		
	},
	
	p33: function(gamma, nucleon, nucleus) {
	
	}
};
