'use strict';

var parser = require('note-parser');

var SynthesizerVoice = require('./SynthesizerVoice');

function Synthesizer(audioContext, output, config) {

  this._audioContext = audioContext;
  this._output = output;

  if (!config) {
    throw new Error('no configuration found');
  }

  if (!config.oscillator) {
    throw new Error('no oscillator config found');
  }

  this._config = config;

}

module.exports = Synthesizer;

Synthesizer.prototype.playFrequencyAt = function(frequency, time, tempo) {

  var synthesizerVoice = new SynthesizerVoice(this._audioContext, this._config, frequency, tempo);

  synthesizerVoice.connect(this._output);
  synthesizerVoice.playAt(time);

};

Synthesizer.prototype.playNoteAt = function(note, time, tempo) {

  var note = note.replace('sharp', '#');

  var frequency = parser.parse(note).freq; // => { letter: 'C', acc: '#', ... midi: 61, freq: 277.1826309768721 }

  this.playFrequencyAt(frequency, time, tempo);

};
