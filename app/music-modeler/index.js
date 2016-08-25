'use strict';

var Modeler = require('bpmn-js/lib/Modeler');

var inherits = require('inherits');

function MusicModeler(options) {
  Modeler.call(this, options);
}

inherits(MusicModeler, Modeler);

MusicModeler.prototype._modules = [].concat(
  MusicModeler.prototype._modules,
  [
    { audioContext: [ 'value', new window.AudioContext() ] },
    { bendpoints: [ 'type', function() {} ]},
    require('./core'),
    require('./features/generator-manager'),
    require('./features/context-pad'),
    require('./features/modeling'),
    require('./features/palette'),
    require('./features/sound-machine'),
    require('./features/visualizer')
  ]
);

module.exports = MusicModeler;
