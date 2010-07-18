exports.PHYS_CONSTS = {
	h_bar: 6.582118E-22,
	c: 3.0E+8,
	r0: 1.5 // in fm
}

exports.PARTICLE_TABLE = {
	photon: {mass: 0, charge: 0},
	
	proton:  {mass: 938.2723, charge: +1}, 
	neutron: {mass: 939.5656, charge:  0},
	
	pi_m: {mass: 134.98, charge: -1},
	pi_0: {mass: 139.57, charge:  0},
	pi_p: {mass: 139.57, charge: +1},
	
	p33_m:  { mass: 1232.0, charge: -1,
		decays: [
			{ratio: 1., products: ["neutron", "pi_m"]}
		]
	},
	p33_0:  { mass: 1232.0, charge:  0,
		decays: [
			{ratio: .331, products: ["proton",  "pi_m"]},
			{ratio: .669, products: ["neutron", "pi_0"]}
		]
	},
	p33_p:  { mass: 1232.0, charge: +1,
		decays: [
			{ratio: .331, products: ["neutron", "pi_p"]},
			{ratio: .669, products: ["proton",  "pi_0"]}
		]
	},
	p33_pp: { mass: 1232.0, charge: +2,
		decays: [
			{ratio: 1., products: ["proton", "pi_p"]}
		]
	},
};

exports.Particle = function(name, momentum, pos) {
	this.name = name || '';
	this.mass = exports.PARTICLE_TABLE[name]['mass'];
	this.pos = pos || [0., 0., 0.]; 

	this.set_p = function(vec)
	{	
		var p = [0., 0., 0., 0.];
		var energy = Math.pow(this.mass, 2);
		for (var i = 0; i < 4; i++){
			p[i] = vec[i];
			energy += Math.pow(p[i], 2);
		}
		p[3] = Math.sqrt(energy);
		this.p = p;
	
		return p;			
	};
	var p = (momentum) ? this.set_p(momentum) : [0., 0., 0., 0];
	this.p = p;
};

var jaguara = {
	each: function(collection, f) { 
		for(var i in collection) { f(i, collection[i]); }
	}
};

function LevelsFactory(particle_name) {
	var levels = [
		{ nf: 3,  vec: [ [1, 1, 1] ] },
		{ nf: 6,  vec: [ [1, 1, 2], [1, 2, 1], [2, 1, 1] ] },
		{ nf: 9,  vec: [ [1, 2, 2], [2, 1, 2], [2, 2, 1] ] },
		{ nf: 11, vec: [ [1, 1, 3], [1, 3, 1], [3, 1, 1] ] },
		{ nf: 12, vec: [ [2, 2, 2] ] },
		{ nf: 14, vec: [ [1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1] ] },
		{ nf: 17, vec: [ [2, 2, 3], [2, 3, 2], [3, 2, 2] ] },
		{ nf: 18, vec: [ [1, 1, 4], [1, 4, 1], [4, 1, 1] ] },
		{ nf: 19, vec: [ [1, 3, 3], [3, 1, 3], [3, 3, 1] ] },
		{ nf: 21, vec: [ [1, 2, 4], [1, 4, 2], [ 2, 1, 4], [ 2, 4, 1], [ 4, 1, 2], [ 4, 2, 1] ] },
		{ nf: 22, vec: [ [2, 3, 3], [3, 2, 3], [ 3, 3, 2] ] },
		{ nf: 24, vec: [ [2, 2, 4], [2, 4, 2], [ 4, 2, 2] ] },
		{ nf: 26, vec: [ [1, 3, 4], [1, 4, 3], [ 3, 1, 4], [ 3, 4, 1], [ 4, 1, 3], [ 4, 3, 1] ] },
		{ nf: 27, vec: [ [1, 1, 5], [1, 5, 1], [ 3, 3, 3], [ 5, 1, 1] ] },
		{ nf: 29, vec: [ [2, 3, 4], [2, 4, 3], [ 3, 2, 4], [ 3, 4, 2], [ 4, 2, 3], [ 4, 3, 2] ] },
		{ nf: 30, vec: [ [1, 2, 5], [1, 5, 2], [ 2, 1, 5], [ 2, 5, 1], [ 5, 1, 2], [ 5, 2, 1] ] },
		{ nf: 33, vec: [ [1, 4, 4], [2, 2, 5], [ 2, 5, 2], [ 4, 1, 4], [ 4, 4, 1], [ 5, 2, 2] ] },
		{ nf: 34, vec: [ [3, 3, 4], [3, 4, 3], [ 4, 3, 3] ] },
		{ nf: 35, vec: [ [1, 3, 5], [1, 5, 3], [ 3, 1, 5], [ 3, 5, 1], [ 5, 1, 3], [ 5, 3, 1] ] },
		{ nf: 36, vec: [ [2, 4, 4], [4, 2, 4], [ 4, 4, 2] ] },
		{ nf: 38, vec: [ [1, 1, 6], [1, 6, 1], [ 2, 3, 5], [ 2, 5, 3], [ 3, 2, 5], [ 3, 5, 2], [ 5, 2, 3], [ 5, 3, 2], [ 6, 1, 1] ] },
		{ nf: 41, vec: [ [1, 2, 6], [1, 6, 2], [ 2, 1, 6], [ 2, 6, 1], [ 3, 4, 4], [ 4, 3, 4], [ 4, 4, 3], [ 6, 1, 2], [ 6, 2, 1] ] },
		{ nf: 42, vec: [ [1, 4, 5], [1, 5, 4], [ 4, 1, 5], [ 4, 5, 1], [ 5, 1, 4], [ 5, 4, 1] ] }
	];
	
	var normalize_vec = function(vec){
		var s = 0;
		for (var i in vec) { s += Math.pow(vec[i],2); }
		s = Math.sqrt(s);

		var ret = [];
		for (var i in vec) { ret.push(vec[i]/s); }
		return ret;
	};

	Level = function(level, level_size) {
		this.particle_name = particle_name;
		this.level_size = level_size;
		this.nf = level.nf;
		this.particles = [];
	
		var count = 0;
		for(var p in level.vec) {
			if (count++ >= level_size) return;
			this.particles.push( new exports.Particle(particle_name, normalize_vec(level.vec[p])) );
		
			if (count++ >= level_size) return;
			this.particles.push( new exports.Particle(particle_name, normalize_vec(level.vec[p])) );			
		};
	
		this.has_space = function(){
			return (this.particles.length < this.level_size);
		};
	};

	this.create = function(total_particles) {
		var n = total_particles;
		var l = [];
			
		jaguara.each(levels, function(i, level) {
			var level_size = (n >= 2 * level.vec.length) ? 2 * level.vec.length: n;
			if (n <= 0) return;
			l.push(new Level(level, level_size))
			n -= level_size;
		});
		return l;
	}
};

exports.Nucleus = function(A, Z) {
	this.A = A;
	this.Z = Z;

	this.protons = (new LevelsFactory('proton')).create(Z);
	this.neutrons = (new LevelsFactory('neutron')).create(A - Z);
	
	var fermi_energy = function(i, level){
		var nf = level.nf;
		var k = Math.pow(nf, 3/2) * Math.PI/3;
		var m = exports.PARTICLE_TABLE[level.particle_name]['mass'];

		level.fermi_energy = 
			Math.pow(exports.PHYS_CONSTS.h_bar * exports.PHYS_CONSTS.c, 2) / (2 * m) * 
			Math.pow(( 3 * Math.pow(Math.PI, 2) * k / (4./3. * Math.PI * A * 
				Math.pow(exports.PHYS_CONSTS.r0 * 1.0E-15, 3.) ) ), 2/3.);	
		return level.fermi_energy;
	};

	var fermi_p = function(i, level) {
		var e_f = level.fermi_energy || fermi_enegy(i, level);
		level.fermi_p = Math.sqrt(2. * exports.PARTICLE_TABLE[level.particle_name]['mass'] * e_f);
		return level.fermi_p;
	};

	var set_momentum = function(i, level){
		fermi_energy(i,level); 
		var fp = fermi_p(i, level);
		var sig = function() { return (Math.random() > .5) ? 1.: -1.; };
	
		jaguara.each(level.particles, function(i, particle) {
			particle.set_p( [ sig() * particle.p[0] * fp,
			 	sig() * particle.p[1] * fp,
			 	sig() * particle.p[2] * fp ] );
		});
	};

	// nuclear radium in fm
	var R = exports.PHYS_CONSTS.r0 * Math.pow(this.A, 1./3.);	
	this.R = R;
	var set_position = function(i, level) {			
		jaguara.each(level.particles, function(i, particle) {
			var phi = 2 * Math.PI * Math.random();
			var cos_a = 1. - 2. * Math.random();
			var sin_a = Math.sqrt(1. - Math.pow(cos_a, 2.));
			var r = R * Math.pow(Math.random(), 1./3.);
			var r_xy = r * sin_a; 
			particle.pos = [ r_xy * Math.cos(phi), r_xy * Math.sin(phi), r * cos_a ];
		});
	};

	jaguara.each(this.protons, function(i, l)  { set_momentum(i, l); set_position(i, l); });
	jaguara.each(this.neutrons, function(i, l) { set_momentum(i, l); set_position(i, l); });

	this.each_nucleon = function(f){
		var p = function(level) { jaguara.each(level.particles, f); }
		for (var i in this.protons) { p(this.protons[i]); }
		for (var j in this.neutrons) { p(this.neutrons[j]); }
	};

};

