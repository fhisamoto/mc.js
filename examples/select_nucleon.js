var sys = require('sys');
var core = require('../lib/core');

var nuc = new core.Nucleus(238,92);
var n = nuc.neutrons[1].particles[1];

nuc.each_nucleon(function(i,nucleon){
	if (n == nucleon) { console.log(sys.inspect(nucleon)) ; }
});