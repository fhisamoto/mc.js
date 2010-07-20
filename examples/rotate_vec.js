var sys = require('sys');

var core = require('../lib/core');
var rot = require('../lib/rotations');

var r = core.LorentzVector([288.9430971949264, -88.94309719492642, -88.94309719492642, 
	1150.835176338764]);

console.log("r: " + r);
var s = rot.lorentz_rotation(r, r);
console.log("rotation: " + s);
console.log("inverse rotation: " + rot.inverse_lorentz_rotation(r, s));
