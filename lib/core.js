var sys = require('sys');
var consts = require('./constants');

var InvalidArgumentException = function() { };

var LorentzVector = function(p) {
	var vec = [0, 0, 0, 0];
	if (p != null) {
		for (var i = 0; i < 4; i++) { vec[i] = p[i] || 0 }
	}
	
	vec.add_vec = function(v) {
		var ret = new exports.LorentzVector();
		for(var i = 0; i < 4; i++) { ret[i] = this[i] + v[i]; }
		return ret;
	};
	
	vec.sub_vec = function(v){
		var ret = new exports.LorentzVector();
		for(var i = 0; i < 4; i++) { ret[i] = this[i] - v[i]; }
		return ret;
	}
	
	vec.s = function() {
		var s = 0;
		for (var i = 0; i < 3; i ++ ) { s += Math.pow(this[i], 2)};
		return Math.pow(this[3], 2) - s;
	}
	
	vec.mag2 = function() {
		return Math.pow(this[0], 2) + Math.pow(this[1], 2) + Math.pow(this[2], 2); 
	}
	
	vec.toString = function() {
		return "[" + this[0] + ", " + this[1] + ", " + this[2] + ", " + this[3] + "]";
	}
	
	var r_xy = function(v) {
		return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2));
	}
	vec.cos_theta = function() {

		return this[0] / r_xy(this);
	}

	vec.sin_theta = function() {
		return this[1] / r_xy(this);
	}
	
	vec.cos_phi = function() {
		return this[2] / Math.sqrt(this.mag2());
	}
	
	vec.sin_phi = function() {
		return Math.sqrt(1 - Math.pow(this.cos_phi(), 2));
	}

	return vec;
}

var Particle = function(name, momentum, pos) {
	this.name = name || '';
	this.mass = consts.PARTICLE_TABLE[name]['mass'];
	
	if (consts.PARTICLE_TABLE[name]['decays'] != null){
		this.width =  consts.PARTICLE_TABLE[name]['width'];
		this.decays = consts.PARTICLE_TABLE[name]['decays'];
	}
	this.pos = pos || new exports.LorentzVector(); 

	this.set_p = function(vec)
	{	
		var k = new exports.LorentzVector(vec);

		var energy = Math.pow(this.mass, 2);
		for (var i = 0; i < 3; i++){
			k[i] = vec[i];
			energy += Math.pow(k[i], 2);
		}
		k[3] = Math.sqrt(energy);		
				
		this.p = k;
		return this.p;
	};
	this.set_p(momentum || [0, 0, 0]);
	
	this.E = function(){ return this.p[3]; }
	
};



function NucleusBuilder(A, Z) {
	var LEVELS = [
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
		for (var i in vec) { s += Math.pow(vec[i], 2); }
		s = Math.sqrt(s);

		var ret = [];
		for (var i in vec) { ret.push(vec[i] / s); }
		return ret;
	};

	Level = function(particle_name, level, level_size) {
		this.particle_name = particle_name;
		this.level_size = level_size;
		this.nf = level.nf || 0;
		this.particles = [];
	
		var count = 0;
		for(var p in level.vec) {
			if (count++ >= level_size) break;
			this.particles.push( new exports.Particle(particle_name, normalize_vec(level.vec[p])) );
		
			if (count++ >= level_size) break;
			this.particles.push( new exports.Particle(particle_name, normalize_vec(level.vec[p])) );
		};
	
		this.has_space = function(){
			return (this.particles.length < this.level_size);
		};
		
		this.each_particle = function(f) { 
			for (var i = 0; i < this.particles.length; i++) { f(this.particles[i]); }
		}
	};

	var create_levels = function(particle_name, total_particles) {
		var n = total_particles;
		var l = [];
		
		for (var i = 0; i < LEVELS.length; i++) {
			var level_size = (n >= 2 * LEVELS[i].vec.length) ? 2 * LEVELS[i].vec.length: n;
			if (n <= 0) break;
			l.push(new Level(particle_name, LEVELS[i], level_size));
			n -= level_size;	
		}
		
		l.each = function(f) { 
			for(var i = 0; i < this.length; i++) { f(this[i]); } 
		}

		return l;
	}
	
	var Nucleus = function(setup) {
		this.A = A;
		this.Z = Z;
		this.R = consts.PHYS_CONSTS.r0 * Math.pow(this.A, 1./3.);
		this.protons = create_levels('proton', this.Z);
		this.neutrons = create_levels('neutron', this.A - this.Z);
		
		setup(this);

		this.select_possible_levels = function(particle, delta_p) {
			if (particle.name != 'proton' || particle.name != 'neutron') {
				throw(new InvalidArgumentException());
			}	

			var possible_levels = [];
			var levels = (particle.name == 'proton') ? this.protons : this.neutrons;
			var p = Math.sqrt(particle.p.mag2());
			for (var i in levels) {
				if (levels[i].fermi_p > p && levels[i].fermi_p < p + delta_p) {
					possible_levels.push(level[i]);
				}
			}
			return possible_levels;
		};

		this.each_nucleon = function(f){
			for (var i = 0; i < this.protons.length; i++) {
				this.protons[i].each_particle(f);
			}
			for (var i = 0; i < this.neutrons.length; i++) {
				this.neutrons[i].each_particle(f);
			}
		};
		
	};
	
	var position = function(R) {
		var phi = 2 * Math.PI * Math.random();
		var cos_a = 1. - 2. * Math.random();
		var sin_a = Math.sqrt(1. - Math.pow(cos_a, 2.));
		var r = R * Math.pow(Math.random(), 1./3.);
		var r_xy = r * sin_a; 
		return new exports.LorentzVector([
			r_xy * Math.cos(phi), 
			r_xy * Math.sin(phi), 
			r * cos_a ]);
	}
	
	var fermi_energy = function(level){
		var nf = level.nf;
		var k = Math.pow(nf, 3/2) * Math.PI/3;
		var m = consts.PARTICLE_TABLE[level.particle_name]['mass'];
		return Math.pow(consts.PHYS_CONSTS.h_bar * consts.PHYS_CONSTS.c, 2) / (2 * m) * 
			Math.pow(( 3 * Math.pow(Math.PI, 2) * k / (4./3. * Math.PI * A * 
			Math.pow(consts.PHYS_CONSTS.r0 * 1.0E-15, 3.) ) ), 2/3.);	
	};
	
	var setup_position_momentum = function(nucleus) {
		var f = function(level) {
			var e_f = fermi_energy(level);
			level.fermi_energy = e_f;
			level.fermi_p = Math.sqrt(2. * consts.PARTICLE_TABLE[level.particle_name]['mass'] * e_f);
			var sig = function() { return (Math.random() > .5) ? 1.: -1.; };
			level.each_particle(function(q) {
				q.set_p( [ 
					sig() * q.p[0] * level.fermi_p,
				 	sig() * q.p[1] * level.fermi_p,
				 	sig() * q.p[2] * level.fermi_p ] );
				q.pos = position(nucleus.R);
			});
		}

		for(var i = 0; i < nucleus.protons.length; i++) { f(nucleus.protons[i]); }
		for(var i = 0; i < nucleus.neutrons.length; i++) { f(nucleus.neutrons[i]); }
	};
	
	return new Nucleus(setup_position_momentum);
};

exports.LorentzVector = LorentzVector;
exports.Particle = Particle;
exports.NucleusBuilder = NucleusBuilder;