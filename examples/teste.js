var sys = require('sys');
var core = require('./core');
var rotations = require('./rotations');

var nuc = new core.Nucleus(24,12);
var p = nuc.protons[0].particles[0];
var g = new core.Particle('photon', [200, 0, 0]);

console.log(sys.inspect(require));


// var r = p.p.add_vec(g.p);
// console.log(sys.inspect(r));
//  
// var s = rotations.lorentz_rotation(r, r);
// console.log(sys.inspect(s));
// 
// var rr = rotations.inverse_lorentz_rotation(r, s);
// console.log(sys.inspect(rr));


