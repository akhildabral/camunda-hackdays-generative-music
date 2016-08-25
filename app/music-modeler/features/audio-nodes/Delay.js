'use strict';

function Delay(audioContext, config) {
  this.audioContext = audioContext;
  var config = config || { delayTime: 0.3, feedback: 0.5 };

  this.delay = this.audioContext.createDelay();
  this.delay.delayTime.value = config.delayTime || 0.3;

  this.feedback = audioContext.createGain();
  this.feedback.gain.value = config.feedback || 0.5;

  this.delay.connect(this.feedback);
  this.feedback.connect(this.delay);

  // configure input and output
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

module.exports = Delay;
