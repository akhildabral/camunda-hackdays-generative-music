'use strict';

var Synthesizer = require('./Synthesizer');

function SynthesizerService(audioContext, eventBus) {
  this._audioContext = audioContext;

  this._compressor = audioContext.createDynamicsCompressor();
  this._compressor.connect(audioContext.destination);

  this._synthesizers = {};

  this.initDefaults();

  /*
  this.startSoundsAt([
    { preset: 'simple', frequency: 440.0 }
    { preset: 'simple', frequency: 880.0 }
  ], 1)
  */
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

SynthesizerService.prototype.startSoundsAt = function(sounds, time) {
  var that = this;

  sounds.forEach(function(sound) {
    that._synthesizers[sound.preset].startFrequencyAt(sound.frequency, time);
  });
}
