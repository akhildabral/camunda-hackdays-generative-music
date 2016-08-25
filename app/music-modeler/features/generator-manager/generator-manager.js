'use strict';

var find = require('lodash/collection/find'),
    forEach = require('lodash/collection/forEach');

var is = require('bpmn-js/lib/util/ModelUtil').is;

var forEach = require('lodash/collection/forEach');

var Generator = require('./generator');

var getDistance = require('../../util/CalcUtil').getDistance,
    isMusicalEvent = require('../../util/MusicModelingUtil').isMusicalEvent;

var DEFAULT_DIVISION = 4; // just need divider coz: 1 / n

var MAX_DIST = 600;

/**
 * @example
 *
 * sounds: {
 *  0: [ { patch }, { patch }],
 *  4: [],
 *  8: [ { patch }],
 *  12: [],
 *  changed: [ 4 ]
 * }
 */
function GeneratorManager(eventBus, executor, elementRegistry) {
  this._eventBus = eventBus;
  this._executor = executor;
  this._elementRegistry = elementRegistry;

  var self = this;

  eventBus.on('master-clock.start', function(context) {
    var numSteps = context.numSteps;

    this._numSteps = numSteps;
  }, this);

  eventBus.on('create.end', function(context) {
    var shape = context.shape;

    if (is(shape, 'bpmn:StartEvent')) {
      this.createNewGenerator(shape);
    }

    // if musical event
    if(isMusicalEvent(shape)) {

      // check distance for all generators
      forEach(this._executor._generators, function(generator) {
        var generatorShape = self._elementRegistry.get(generator.id);

        if (getDistance(shape, generatorShape) <= MAX_DIST) {

          // register sound on generator
          generator.registerSound(shape);

        }

      });

    }

  }, this);

  eventBus.on('shape.delete', function(context) {
    var shape = context.shape;

    if (is(shape, 'bpmn:StartEvent')) {
      executor.removeGenerator(shape.id);
    }
  }, this);

  eventBus.on('generator.connect', function(context) {
    var shape = context.shape;

    // triggered on automatic connection of generator with musical event

  }, this);

  eventBus.on('move.move.end', function(context) {
    var shape = context.shape;

    var generator = this.findGenerator(shape);

    if (!generator) {
      return;
    }

    generator.update(shape);
  }, this);

  eventBus.on('elements.changed', function(context) {

    var self = this;

    forEach(context.elements, function(element) {

      // if it is a generator
      if (is(element, 'bpmn:StartEvent') && element.type !== 'label') {

        var newSubDivision = element.businessObject.timeDivision;

        var generator = self._executor.getGenerator(element.id);

        if (generator) {
          generator.updateSubDivision(newSubDivision);
        }
      }
    });

  }, this);
}

module.exports = GeneratorManager;

GeneratorManager.$inject = [ 'eventBus', 'executor', 'elementRegistry' ];


GeneratorManager.prototype.findGenerator = function(shape) {
  var executor = this._executor;

  var generators = executor.getAllGenerators();

  return find(generators, function(generator) {
    return generator.outgoing.indexOf(shape);
  });
};

GeneratorManager.prototype.exists = function(shape) {
  return !!this._executor._generators[shape.id];
};

GeneratorManager.prototype.createNewGenerator = function(shape) {
  var executor = this._executor;

  var numSteps = this._numSteps;

  var generator = new Generator(numSteps, DEFAULT_DIVISION, MAX_DIST);

  generator.id = shape.id;

  executor.registerGenerator(generator);
};
