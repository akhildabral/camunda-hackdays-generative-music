'use strict';

var Synthesizer = require('./Synthesizer');

/**
 * A service that plays synthesizer sounds.
 *
 * Usage:
 * this.playSoundsAt([
 *  { preset: 'simple', note: 'c#4' },
 *  { preset: 'simple', note: 'd4' }
 * ], 1);
 */
function SynthesizerService(audioContext, eventBus) {
  this._audioContext = audioContext;

  this._compressor = audioContext.createDynamicsCompressor();
  this._compressor.connect(audioContext.destination);

  this._synthesizers = {};

  this.initDefaults();
}

module.exports = SynthesizerService;

SynthesizerService.$inject = [ 'audioContext', 'eventBus' ];

SynthesizerService.prototype.initDefaults = function() {

  var simple = new Synthesizer(this._audioContext, this._compressor, {
    oscillator: {
      type: 'sine'
    },
    envelope: {
      attack: 0.1,
      release: 0.1,
      amplitude: 0.3
    },
    filter: {
      type: 'lowpass',
      q: '6',
      frequency: '2000'
    },
    delay: {
      delayTime: 0.5,
      feedback: 0.5
    },
    reverb: {
      duration: 1.0,
      decay: 1.0,
      reverse: true
    }
  });

  this._synthesizers['simple'] = simple;

};

SynthesizerService.prototype.addSynthesizer = function(name, synthesizer) {
  if (this._synthesizers[name]) {
    throw new Error('synthesizer with specified name already exists');
  }

  this._synthesizers[name] = synthesizer;
}

SynthesizerService.prototype.getSynthesizers = function() {
  return this._synthesizers;
}

SynthesizerService.prototype.playSoundsAt = function(sounds, time) {
  var that = this;

  sounds.forEach(function(sound) {
    that._synthesizers[sound.preset].playNoteAt(sound.note, time);
  });
}
