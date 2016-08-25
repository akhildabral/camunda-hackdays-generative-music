'use strict';

var pick = require('lodash/object/pick');

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
        delayTime: 0.5,
        feedback: 0.5
      },
      reverb: {
        duration: 1.0,
        decay: 1.0,
        reverse: false
      }
    })
  };

  this._presets['synthesizer:bell'] = synthesizerBell;


  // 808 kick
  var samplerKick = {
    label: '808 Kick',
    type: 'drums',
    preset: new Sampler(this._audioContext, this._compressor, {
      url: 'samples/kick.wav',
      rootKey: 'c3'
    })
  }

  this._presets['sampler:kick'] = samplerKick;

  // 808 clap
  var samplerClap = {
    label: '808 Clap',
    type: 'drums',
    preset: new Sampler(this._audioContext, this._compressor, {
      url: 'samples/clap.wav',
      rootKey: 'c3'
    })
  }

  this._presets['sampler:clap'] = samplerClap;

  // 808 clave
  var samplerClave = {
    label: '808 Clave',
    type: 'drums',
    preset: new Sampler(this._audioContext, this._compressor, {
      url: 'samples/clave.wav',
      rootKey: 'c3'
    })
  }

  this._presets['sampler:clave'] = samplerClave;

  // 808 closed hat
  var samplerClosedHat = {
    label: '808 Closed Hat',
    type: 'drums',
    preset: new Sampler(this._audioContext, this._compressor, {
      url: 'samples/closedhat.wav',
      rootKey: 'c3'
    })
  }

  this._presets['sampler:closedhat'] = samplerClosedHat;

  // 808 cowbell
  var samplerCowbell = {
    label: '808 Cowbell',
    type: 'drums',
    preset: new Sampler(this._audioContext, this._compressor, {
      url: 'samples/cowbell.wav',
      rootKey: 'c3'
    })
  }

  this._presets['sampler:cowbell'] = samplerCowbell;

  // 808 crash
  var samplerCrash = {
    label: '808 Crash',
    type: 'drums',
    preset: new Sampler(this._audioContext, this._compressor, {
      url: 'samples/crash.wav',
      rootKey: 'c3'
    })
  }

  this._presets['sampler:crash'] = samplerCrash;

  // 808 open hat
  var samplerOpenHat = {
    label: '808 Open Hat',
    type: 'drums',
    preset: new Sampler(this._audioContext, this._compressor, {
      url: 'samples/openhat.wav',
      rootKey: 'c3'
    })
  }

  this._presets['sampler:openhat'] = samplerOpenHat;

  // 808 rim
  var samplerRim = {
    label: '808 Rim',
    type: 'drums',
    preset: new Sampler(this._audioContext, this._compressor, {
      url: 'samples/rim.wav',
      rootKey: 'c3'
    })
  }

  this._presets['sampler:rim'] = samplerRim;

  // 808 snare
  var samplerSnare = {
    label: '808 Snare',
    type: 'drums',
    preset: new Sampler(this._audioContext, this._compressor, {
      url: 'samples/snare.wav',
      rootKey: 'c3'
    })
  }

  this._presets['sampler:snare'] = samplerSnare;

};

SoundMachine.prototype.playSoundAt = function(sound, time) {
  if (!this._presets[sound.preset]) {
    throw new Error('preset not found');
  }

  this._presets[sound.preset].preset.playNoteAt(sound.note, time);
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

SoundMachine.prototype.getAll = function() {
  return this._presets;
}

SoundMachine.prototype.getSounds = function(type) {
  return pick(this._presets, function(preset) {
    return preset.type === type;
  });
}
