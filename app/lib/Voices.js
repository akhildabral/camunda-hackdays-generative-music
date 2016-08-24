'use strict';

var Voice = require('./Voice');

function Voices(audioContext, output, config) {

  this.audioContext = audioContext;
  this.output = output;

  if (!config) {
    throw new Error('no configuration found');
  }

  if (!config.oscillator) {
    throw new Error('no oscillator config found');
  }

  this.config = config;

}

Voices.prototype.startAt = function(frequency, time) {

  var voice = new Voice(this.audioContext, this.config, frequency);

  voice.connect(this.output);
  voice.startAt(time);

}

module.exports = Voices;
