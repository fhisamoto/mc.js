var sys = require('sys');

var core = require('../lib/core');
var photon_cs = require('../lib/photon_cs');

var nuc = new core.Nucleus(24, 12);
var p = nuc.protons[0].particles[0];
var gamma = new core.Particle('photon', [200, 0, 0]);

console.log("-- in particles");
console.log(sys.inspect(gamma));
console.log(sys.inspect(p));

var particles = photon_cs.photon_events.one_pion(gamma, p);

console.log("-- out particles");
console.log(sys.inspect(particles));

var q0 = p.p.add_vec(gamma.p);
var q1 = particles[0].p.add_vec(particles[1].p);

console.log("-- p_0");
console.log(q0);

console.log("-- p_f");
console.log(q1); 
