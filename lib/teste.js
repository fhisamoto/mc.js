var sys = require('sys');
var core = require('./core');
var rotations = require('./rotations');

var add_vec = function(v1, v2) {
	var ret = [0, 0, 0, 0];
	for(var i in ret) { ret[i] = v1[i] + v2[i]; }
	return ret;
}


var p = new core.Particle('photon', [200, 0, 0]);
var nuc = new core.Nucleus(24, 12);

var q = nuc.protons[0].particles[0];

// console.log(sys.inspect(p));
// console.log(sys.inspect(q));


var r = add_vec(p.p, q.p);

console.log(sys.inspect(r));

var s = rotations.lorentz_rotation(r, r);
console.log(sys.inspect(s));

console.log(sys.inspect(rotations.inverse_lorentz_rotation(r, s)));