'use strict';

var propertiesPanelModule = require('bpmn-js-properties-panel'),
    propertiesProviderModule = require('./custom-properties-panel/providers/music'),
    musicModdleDescriptor = require('./custom-properties-panel/descriptors/music');

var CustomModeler = require('./custom-modeler');

var modeler = new CustomModeler({
  container: '#canvas',
  keyboard: { bindTo: document },
  propertiesPanel: {
    parent: '#js-properties-panel'
  },
  additionalModules: [
    propertiesPanelModule,
    propertiesProviderModule
  ],
  moddleExtensions: {
    music: musicModdleDescriptor
  }
});


modeler.createDiagram();

window.bpmnjs = modeler;

// audio nodes test
var audioContext = new AudioContext();

var Oscillator = require('./lib/audio-nodes/Oscillator'),
    Gain = require('./lib/audio-nodes/Gain'),
    EnvelopeGenerator = require('./lib/audio-nodes/EnvelopeGenerator');

var oscillator = new Oscillator(audioContext, { type: 'square' }),
    gain = new Gain(audioContext),
    envelopeGenerator = new EnvelopeGenerator({ attack: 0.1, release: 0.2, amplitude: 0.3 });
