var PHYS_CONSTS = {
	h_bar: 6.582118E-22,
	c: 3.0E+8,
	r0: 1.5 // in fm
}

var PARTICLE_TABLE = {
	photon: {mass: 0., charge: 0},
	
	proton:  {mass: 938.2723, charge: +1}, 
	neutron: {mass: 939.5656, charge:  0},
	
	pi_m: {mass: 134.98, charge: -1},
	pi_0: {mass: 139.57, charge:  0},
	pi_p: {mass: 139.57, charge: +1},
	
	p33_m:  { mass: 1232.0, width: 118.0, charge: -1,
		decays: [
			{ratio: 1., products: ["neutron", "pi_m"]}
		]
	},
	p33_0:  { mass: 1232.0, width: 118.0, charge:  0,
		decays: [
			{ratio: .331, products: ["proton",  "pi_m"]},
			{ratio: .669, products: ["neutron", "pi_0"]}
		]
	},
	p33_p:  { mass: 1232.0, width: 118.0, charge: +1,
		decays: [
			{ratio: .331, products: ["neutron", "pi_p"]},
			{ratio: .669, products: ["proton",  "pi_0"]}
		]
	},
	p33_pp: { mass: 1232.0, width: 118.0, charge: +2,
		decays: [
			{ratio: 1., products: ["proton", "pi_p"]}
		]
	},
};

exports.PHYS_CONSTS = PHYS_CONSTS;
exports.PARTICLE_TABLE = PARTICLE_TABLE;
