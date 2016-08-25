'use strict';

var Modeler = require('bpmn-js/lib/Modeler');

var inherits = require('inherits');

var audioContext = new window.AudioContext();

function MusicModeler(options) {
  Modeler.call(this, options);
}

inherits(MusicModeler, Modeler);

MusicModeler.prototype._modules = [].concat(
  MusicModeler.prototype._modules,
  [
    {
      audioContext: [ 'value', audioContext ]
    },
    require('./core'),
    require('./features/generator')
  ]
);

module.exports = MusicModeler;
