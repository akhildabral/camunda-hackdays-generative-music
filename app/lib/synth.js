'use strict';

// global audio audioContext
var audioContext = new AudioContext();

// building blocks of our patches

////////// oscillator //////////
var Oscillator = (function(audioContext) {
  function Oscillator(type){
    this.oscillator = audioContext.createOscillator();
    this.oscillator.type = type || 'sawtooth';
    this.setFrequency(440);
    this.oscillator.start(0);

    this.input = this.oscillator;
    this.output = this.oscillator;
  };

  Oscillator.prototype.setFrequency = function(frequency) {
    this.oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  };

  Oscillator.prototype.setFrequencyAt = function(frequency, targetTime) {
    this.oscillator.frequency.setValueAtTime(frequency, targetTime);
  };

  Oscillator.prototype.connect = function(node) {
    if (node.hasOwnProperty('input')) {
      this.output.connect(node.input);
    } else {
      this.output.connect(node);
    };
  }

  return Oscillator;
})(audioContext);

////////// envelope generator //////////

// very simple envelope generator without decay & sustain
var EnvelopeGenerator = (function(audioContext) {
  function EnvelopeGenerator(config) {
    var config = config || {};

    // defaults to gate behaviour
    this.attack = config.attack || 0.0;
    this.release = config.release || 0.0;
    this.amplitude = config.amplitude || 0.3;
  };

  // trigger with optional delay
  EnvelopeGenerator.prototype.trigger = function(delay) {
    delay = delay || 0;

    now = audioContext.currentTime;
    this.param.cancelScheduledValues(now + delay);
    this.param.setValueAtTime(0, now + delay);
    this.param.linearRampToValueAtTime(this.amplitude, now + delay + this.attack);
    this.param.linearRampToValueAtTime(0, now + delay + this.attack + this.release);
  };

  // trigger at specified time
  EnvelopeGenerator.prototype.triggerAt = function(targetTime) {
    this.param.cancelScheduledValues(targetTime);
    this.param.setValueAtTime(0, targetTime);
    this.param.linearRampToValueAtTime(1, targetTime + this.attack);
    this.param.linearRampToValueAtTime(0, targetTime + this.attack + this.release);
  }

  EnvelopeGenerator.prototype.connect = function(param) {
    this.param = param;
  };

  return EnvelopeGenerator;
})(audioContext);

////////// gain //////////
var Gain = (function(audioContext) {
  function Gain() {
    this.gain = audioContext.createGain();

    this.gain.gain.value = 0;
    this.amplitude = this.gain.gain;

    this.input = this.gain;
    this.output = this.gain;
  };

  Gain.prototype.connect = function(node) {
    if (node.hasOwnProperty('input')) {
      this.output.connect(node.input);
    } else {
      this.output.connect(node);
    };
  }

  return Gain;
})(audioContext);

////////// delay //////////
var Delay = (function(audioContext) {

  function Delay() {
    this.delay = audioContext.createDelay();
    this.delay.delayTime.value = 0.3;

    this.feedback = audioContext.createGain();
    this.feedback.gain.value = 0.5;

    this.filter = audioContext.createBiquadFilter();
    this.filter.frequency.value = 5000;

    this.delay.connect(this.feedback);
    this.feedback.connect(this.filter);
    this.filter.connect(this.delay);

    this.input = this.delay;
    this.output = this.delay;
  }

  Delay.prototype.connect = function(node) {
    if (node.hasOwnProperty('input')) {
      this.output.connect(node.input);
    } else {
      this.output.connect(node);
    };
  }

  return Delay;

})(audioContext);

////////// filter //////////
var Filter = (function(audioContext) {

  function Filter(type) {
    this.filter = audioContext.createBiquadFilter();
    this.type = type || this.filter.LOWPASS;

    this.filter.type = this.type;
    this.filter.Q.value = 6;
    this.filter.frequency.value = 2000;

    this.input = this.filter;
    this.output = this.filter;
  }

  Filter.prototype.connect = function(node) {
    if (node.hasOwnProperty('input')) {
      this.output.connect(node.input);
    } else {
      this.output.connect(node);
    };
  }

  return Filter;

})(audioContext);

////////// reverb //////////
var Reverb = (function(audioContext) {

  function Reverb() {
    this.convolver = audioContext.createConvolver();
    this.convolver.buffer = impulseResponse(1, 1, false);

    this.input = this.output = this.convolver;
  }

  function impulseResponse(duration, decay, reverse) {
    var sampleRate = audioContext.sampleRate;
    var length = sampleRate * duration;
    var impulse = audioContext.createBuffer(2, length, sampleRate);
    var impulseL = impulse.getChannelData(0);
    var impulseR = impulse.getChannelData(1);

    if (!decay)
        decay = 2.0;

    for (var i = 0; i < length; i++){
      var n = reverse ? length - i : i;
      impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
      impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
    }

    return impulse;
  }

  Reverb.prototype.connect = function(node) {
    if (node.hasOwnProperty('input')) {
      this.output.connect(node.input);
    } else {
      this.output.connect(node);
    };
  }

  return Reverb;

})(audioContext);

////////// patches //////////
var patches = {};

// a patch consists only of oscillator, optional envelope generator and optional filter
// delay and reverb are applied globally
function Patch(config, audioContext) {
  if (!config.oscillator) {
    throw new Error('no oscillator config found');
  }

  this.oscillator = new Oscillator();
  this.oscillator.type = config.oscillator.type || 'sine';
  this.gain = new Gain(0.3);
  this.envelope = new EnvelopeGenerator(config.envelope);

  this.oscillator.connect(this.gain);
  this.envelope.connect(this.gain.amplitude);

  // TODO connect to configurable output instead of destination
  this.gain.connect(audioContext.destination);
}

function addPatch(name, patch) {
  patches[name] = patch;
}

////////// sample patch //////////
addPatch('simple', new Patch({
  oscillator: {
    type: 'sine'
  },
  envelope: {
    attack: 0.1,
    release: 0.2,
    amplitude: 0.3
  },
  filter: {
    type: 'lowpass',
    frequency: '1000'
  }
}, audioContext));
