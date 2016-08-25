'use strict';

var pick = require('lodash/object/pick'),
    forEach = require('lodash/collection/forEach');

var Synthesizer = require('../synthesizer/Synthesizer'),
    Sampler = require('../sampler/Sampler');

function SoundMachine(audioContext, masterClock) {
  this._audioContext = audioContext;
  this._masterClock = masterClock;

  this._compressor = audioContext.createDynamicsCompressor();
  this._compressor.connect(audioContext.destination);

  this._presets = {};

  this.initDefaults();
}

SoundMachine.$inject = [ 'audioContext', 'masterClock' ];

module.exports = SoundMachine;

SoundMachine.prototype.initDefaults = function() {

  // bell synthesizer
  var synthesizerBell = {
    label: 'Bell',
    type: 'instrument',
    preset: new Synthesizer(this._audioContext, this._compressor, {
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
        delayTime: 0.5, // TODO take current tempo into account
        feedback: 0.5
      }
    })
  };

  this._presets.synthesizerBell = synthesizerBell;

  // lead synthesizer
  var synthesizerSquareLead = {
    label: 'Square Lead',
    type: 'instrument',
    preset: new Synthesizer(this._audioContext, this._compressor, {
      oscillator: {
        type: 'square'
      },
      envelope: {
        attack: 0.1,
        release: 0.1,
        amplitude: 0.3
      },
      filter: {
        type: 'lowpass',
        q: '6',
        frequency: '10000'
      },
      delay: {
        delayTime: 0.2,
        feedback: 0.5
      }
    })
  };

  this._presets.synthesizerSquarelead = synthesizerSquareLead;

  // 808 kick
  var samplerKick = {
    label: '808 Kick',
    type: 'drums',
    preset: new Sampler(this._audioContext, this._compressor, {
      url: 'samples/kick.wav',
      rootKey: 'c3'
    })
  };

  this._presets.samplerKick = samplerKick;

  // 808 clap
  var samplerClap = {
    label: '808 Clap',
    type: 'drums',
    preset: new Sampler(this._audioContext, this._compressor, {
      url: 'samples/clap.wav',
      rootKey: 'c3'
    })
  };

  this._presets.samplerClap = samplerClap;

  // 808 clave
  var samplerClave = {
    label: '808 Clave',
    type: 'drums',
    preset: new Sampler(this._audioContext, this._compressor, {
      url: 'samples/clave.wav',
      rootKey: 'c3'
    })
  };

  this._presets.samplerClave = samplerClave;

  // 808 closed hat
  var samplerClosedHat = {
    label: '808 Closed Hat',
    type: 'drums',
    preset: new Sampler(this._audioContext, this._compressor, {
      url: 'samples/closedhat.wav',
      rootKey: 'c3'
    })
  };

  this._presets.samplerClosedHat = samplerClosedHat;

  // 808 cowbell
  var samplerCowbell = {
    label: '808 Cowbell',
    type: 'drums',
    preset: new Sampler(this._audioContext, this._compressor, {
      url: 'samples/cowbell.wav',
      rootKey: 'c3'
    })
  };

  this._presets.samplerCowbell = samplerCowbell;

  // 808 crash
  var samplerCrash = {
    label: '808 Crash',
    type: 'drums',
    preset: new Sampler(this._audioContext, this._compressor, {
      url: 'samples/crash.wav',
      rootKey: 'c3'
    })
  };

  this._presets.samplerCrash = samplerCrash;

  // 808 open hat
  var samplerOpenHat = {
    label: '808 Open Hat',
    type: 'drums',
    preset: new Sampler(this._audioContext, this._compressor, {
      url: 'samples/openhat.wav',
      rootKey: 'c3'
    })
  };

  this._presets.samplerOpenHat = samplerOpenHat;

  // 808 rim
  var samplerRim = {
    label: '808 Rim',
    type: 'drums',
    preset: new Sampler(this._audioContext, this._compressor, {
      url: 'samples/rim.wav',
      rootKey: 'c3'
    })
  };

  this._presets.samplerRim = samplerRim;

  // 808 snare
  var samplerSnare = {
    label: '808 Snare',
    type: 'drums',
    preset: new Sampler(this._audioContext, this._compressor, {
      url: 'samples/snare.wav',
      rootKey: 'c3'
    })
  };

  this._presets.samplerSnare = samplerSnare;

};

SoundMachine.prototype.playSoundAt = function(sound, time) {
  if (!this._presets[sound.preset]) {
    throw new Error('preset not found');
  }

  this._presets[sound.preset].preset.playNoteAt(sound.note, time);
};

SoundMachine.prototype.playPatches = function(sounds, time) {

  forEach(sounds, function(sound) {
    this.playSoundAt(sound, time);
  }, this);
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
};

SoundMachine.prototype.getAll = function() {
  return this._presets;
};

SoundMachine.prototype.getSounds = function(type) {
  return pick(this._presets, function(preset) {
    return preset.type === type;
  });
};
