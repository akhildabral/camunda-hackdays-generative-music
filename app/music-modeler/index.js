'use strict';

var Modeler = require('bpmn-js/lib/Modeler');

var assign = require('lodash/object/assign'),
    isArray = require('lodash/lang/isArray');

var inherits = require('inherits');

function MusicModeler(options) {
  Modeler.call(this, options);
}

inherits(MusicModeler, Modeler);

MusicModeler.prototype._modules = [].concat(
  MusicModeler.prototype._modules,
  [
    { audioContext: [ 'value', new AudioContext() ] },
    require('./core'),
    require('./features/context-pad'),
    require('./features/palette'),
    require('./features/sound-machine')
  ]
);

module.exports = MusicModeler;
