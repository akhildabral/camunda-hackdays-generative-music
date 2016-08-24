'use strict';

function Oscillator(audioContext, config) {
    this.audioContext = audioContext;
    var config = config || { type: 'sine' };

    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.type = config.type;
    this.setFrequency(440);
    this.oscillator.start(0);

    // configure input and output
    this.input = this.oscillator;
    this.output = this.oscillator;

}

Oscillator.prototype.setFrequency = function(frequency) {

  this.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

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

module.exports = Oscillator;
