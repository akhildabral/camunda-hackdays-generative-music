'use strict';

var Synthesizer = require('../synthesizer/Synthesizer'),
    Sampler = require('../sampler/Sampler');

function SoundMachine(audioContext) {
  this._audioContext = audioContext;

  this._compressor = audioContext.createDynamicsCompressor();
  this._compressor.connect(audioContext.destination);

  this._presets = {};

  this.initDefaults();
}

SoundMachine.$inject = [ 'audioContext' ];

module.exports = SoundMachine;

SoundMachine.prototype.initDefaults = function() {

  var synthesizerBell = new Synthesizer(this._audioContext, this._compressor, {
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
      reverse: false
    }
  });

  this._presets['synthesizer:bell'] = synthesizerBell;

  var samplerKick = new Sampler(this._audioContext, this._compressor, {
    url: 'samples/kick.wav',
    rootKey: 'c3'
  });

  this._presets['sampler:kick'] = samplerKick;

  var samplerMusic = new Sampler(this._audioContext, this._compressor, {
    url: 'samples/music.wav',
    rootKey: 'c3'
  });

  this._presets['sampler:music'] = samplerMusic;

};

SoundMachine.prototype.playSoundAt = function(sound, time) {
  if (!this._presets[sound.preset]) {
    throw new Error('preset not found');
  }

  // default note for drum sounds
  this._presets[sound.preset].playNoteAt(sound.note || 'c1', time);
}

SoundMachine.prototype.playSoundsAt = function(sounds, time) {
  var that = this;

  sounds.forEach(function(sound) {
    that.playSoundAt(sound, time);
  });
};

SoundMachine.prototype.addSound = function(name, sound) {
  if (this._presets[name]) {
    throw new Error('sound with specified name already exists');
  }

  this._presets[name] = sound;
};

SoundMachine.prototype.removeSound = function(name) {
  if (!this._presets[name]) {
    return;
  }

  delete this._presets[name];
}

SoundMachine.prototype.getSounds = function() {
  return this._presets;
}
