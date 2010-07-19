var sys = require('sys');

var core = require('../lib/core');
var gen = require('../lib/events_generator');
var photons = require('../lib/photon_cs');

console.log("Creating a generator ... ");
var gina = new gen.EventsGenerator(photons.cross_sections_in_fermi);
var nuc = new core.Nucleus(24,12);

var cs = [];
while (cs.length == 0) {
	cs = gina.generate(new core.Particle('photon', [300, 0, 0]), nuc);
}
console.log(sys.inspect(cs));

