'use strict';

var propertiesPanelModule = require('bpmn-js-properties-panel'),
    propertiesProviderModule = require('./custom-properties-panel/providers/music'),
    musicModdleDescriptor = require('./custom-properties-panel/descriptors/music');

var MusicModeler = require('./music-modeler');

var modeler = new MusicModeler({
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
    EnvelopeGenerator = require('./lib/audio-nodes/EnvelopeGenerator'),
    Delay = require('./lib/audio-nodes/Delay'),
    Filter = require('./lib/audio-nodes/Filter'),
    Reverb = require('./lib/audio-nodes/Reverb');

var oscillator = new Oscillator(audioContext, { type: 'square' }),
    gain = new Gain(audioContext),
    envelopeGenerator = new EnvelopeGenerator({ attack: 0.1, release: 0.2, amplitude: 0.3 }),
    delay = new Delay(audioContext, { delayTime: 0.5, feedback: 0.5 }),
    filter = new Filter(audioContext, { type: 'lowpass', frequency: 2000.0 }),
    reverb = new Reverb(audioContext, { duration: 2.0, decay: 1.0, reverse: true });
