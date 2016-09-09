'use strict';

var Viewer = require('bpmn-js/lib/Viewer');

var inherits = require('inherits');

var Ids = require('ids');


function MusicModeler(options) {
  Viewer.call(this, options);

  // hook ID collection into the modeler
  this.on('import.parse.complete', function(event) {
    if (!event.error) {
      this._collectIds(event.definitions, event.context);
    }
  }, this);

  this.on('diagram.destroy', function() {
    this.moddle.ids.clear();
  }, this);
}

inherits(MusicModeler, Viewer);

MusicModeler.prototype._modules = [].concat(
  [
    require('bpmn-js/lib/core'),
    require('diagram-js/lib/features/selection'),
    require('diagram-js/lib/features/overlays'),
    require('diagram-js/lib/features/auto-scroll'),
    require('diagram-js/lib/navigation/movecanvas'),
    require('diagram-js/lib/navigation/touch'),
    require('diagram-js/lib/navigation/zoomscroll'),
    require('diagram-js/lib/features/move'),
    require('diagram-js/lib/features/resize'),
    require('bpmn-js/lib/features/editor-actions'),
    require('bpmn-js/lib/features/context-pad'),
    require('bpmn-js/lib/features/keyboard'),
    require('bpmn-js/lib/features/modeling'),
    require('bpmn-js/lib/features/palette')
  ],
  [
    { audioContext: [ 'value', new window.AudioContext() ] },
    { bendpoints: [ 'type', function() {} ]},
    { labelEditingProvider: [ 'type', function() {} ]},
    { labelBehavior: [ 'type', function() {} ] },
    require('./core'),
    require('./features/generator-manager'),
    require('./features/harmony'),
    require('./features/context-pad'),
    require('./features/modeling'),
    require('./features/palette'),
    require('./features/sound-machine'),
    require('./features/visualizer'),
    require('./features/generator-visualizer')
  ]
);

module.exports = MusicModeler;

/**
 * Create a moddle instance, attaching ids to it.
 *
 * @param {Object} options
 */
MusicModeler.prototype._createModdle = function(options) {
  var moddle = Viewer.prototype._createModdle.call(this, options);

  // attach ids to moddle to be able to track
  // and validated ids in the BPMN 2.0 XML document
  // tree
  moddle.ids = new Ids([ 32, 36, 1 ]);

  return moddle;
};

/**
 * Collect ids processed during parsing of the
 * definitions object.
 *
 * @param {ModdleElement} definitions
 * @param {Context} context
 */
MusicModeler.prototype._collectIds = function(definitions, context) {

  var moddle = definitions.$model,
      ids = moddle.ids,
      id;

  // remove references from previous import
  ids.clear();

  for (id in context.elementsById) {
    ids.claim(id, context.elementsById[id]);
  }
};
