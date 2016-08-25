'use strict';

var BufferSource = require('../audio-nodes/BufferSource');

function SamplerVoice(audioContext, config) {
  this.audioContext = audioContext;

  if (!config) {
    throw new Error('no configuration found');
  }

  this.bufferSource = new BufferSource(this.audioContext, config);

  this.output = this.bufferSource;

}

module.exports = SamplerVoice;

SamplerVoice.prototype.connect = function(node) {

  if (node.hasOwnProperty('input')) {
    this.output.connect(node.input);
  } else {
    this.output.connect(node);
  };

};

SamplerVoice.prototype.playAt = function(time) {

  this.bufferSource.playAt(time);

};
