'use strict';

var Oscillator = require('./audio-nodes/Oscillator'),
    Gain = require('./audio-nodes/Gain'),
    EnvelopeGenerator = require('./audio-nodes/EnvelopeGenerator'),
    Filter = require('./audio-nodes/Filter'),
    Delay = require('./audio-nodes/Delay'),
    Reverb = require('./audio-nodes/Reverb');

function Voice (audioContext, config, frequency) {
  this.audioContext = audioContext;

  if (!config) {
    throw new Error('no configuration found');
  }

  if (!config.oscillator) {
    throw new Error('no oscillator config found');
  }

  // oscillator
  this.oscillator = new Oscillator(this.audioContext, config.oscillator, frequency);

  // gain
  this.gain = new Gain(this.audioContext);

  // envelope generator
  this.envelope = new EnvelopeGenerator(this.audioContext, config.envelope);

  // filter
  this.filter = new Filter(this.audioContext, config.envelope);

  // delay
  this.delay = new Delay(this.audioContext, config.delay);

  // reverb
  this.reverb = new Reverb(this.audioContext, config.reverb);

  // wiring up stuff
  this.oscillator.connect(this.gain);
  this.envelope.connect(this.gain.amplitude);
  this.gain.connect(this.filter);
  this.filter.connect(this.delay);
  this.delay.connect(this.reverb);

  // configure output
  this.output = this.reverb;

}

Voice.prototype.connect = function(node) {

  if (node.hasOwnProperty('input')) {
    this.output.connect(node.input);
  } else {
    this.output.connect(node);
  };

}

Voice.prototype.startAt = function(time) {

  this.envelope.triggerAt(time);

};

module.exports = Voice;
