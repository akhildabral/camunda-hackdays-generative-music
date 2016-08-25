'use strict';

var parser = require('note-parser')

var Voice = require('./Voice');

function Synthesizer(audioContext, output, config) {

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

Synthesizer.prototype.playFrequencyAt = function(frequency, time) {

  var voice = new Voice(this.audioContext, this.config, frequency);

  voice.connect(this.output);
  voice.startAt(time);

};

Synthesizer.prototype.playNoteAt = function(note, time) {

  var frequency = parser.parse(note).freq; // => { letter: 'C', acc: '#', ... midi: 61, freq: 277.1826309768721 }

  this.playFrequencyAt(frequency, time);

};

module.exports = Synthesizer;
