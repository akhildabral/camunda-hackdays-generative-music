'use strict';

var Oscillator = require('./audio-nodes/Oscillator'),
    Gain = require('./audio-nodes/Gain'),
    EnvelopeGenerator = require('./audio-nodes/EnvelopeGenerator'),
    Filter = require('./audio-nodes/Filter');

function Patch(audioContext, config) {

  this.audioContext = audioContext;

  if (!config) {
    throw new Error('no configuration found');
  }

  if (!config.oscillator) {
    throw new Error('no oscillator config found');
  }

  this.oscillator = new Oscillator(this.audioContext, config.oscillator);
  this.gain = new Gain(this.audioContext);
  this.envelope = new EnvelopeGenerator(this.audioContext, config.envelope);

  this.oscillator.connect(this.gain);
  this.envelope.connect(this.gain.amplitude);

  // configure output
  this.output = this.gain;

}

Patch.prototype.connect = function(node) {

  if (node.hasOwnProperty('input')) {
    this.output.connect(node.input);
  } else {
    this.output.connect(node);
  };

}

Patch.prototype.playAt = function(frequency, time) {

  this.oscillator.setFrequencyAt(frequency, time);
  this.envelope.triggerAt(time);

}

module.exports = Patch;
