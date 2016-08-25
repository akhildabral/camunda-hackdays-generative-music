'use strict';

var find = require('lodash/collection/find'),
    forEach = require('lodash/collection/forEach');

var is = require('bpmn-js/lib/util/ModelUtil').is;

var forEach = require('lodash/collection/forEach');

var Generator = require('./generator');

var getDistance = require('diagram-js/lib/util/Geometry').pointDistance,
    isMusicalEvent = require('../../util/MusicModelingUtil').isMusicalEvent;

var DEFAULT_DIVISION = 16; // just need divider coz: 1 / n

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
function GeneratorManager(eventBus, executor, elementRegistry, modeling) {
  this._eventBus = eventBus;
  this._executor = executor;
  this._elementRegistry = elementRegistry;

  eventBus.on('master-clock.start', function(context) {
    var numSteps = context.numSteps;

    this._numSteps = numSteps;
  }, this);

  eventBus.on('create.end', function(context) {
    var shape = context.shape,
        generators;

    if (is(shape, 'bpmn:StartEvent')) {
      var generator = this.createNewGenerator(shape);

      var musicalElements = this._elementRegistry.filter(function(element) {
        return isMusicalEvent(element);
      });

      forEach(musicalElements, function(element) {

        if (getDistance(shape, element) <= MAX_DIST) {

          var stepNumber = generator.calculateStepNumber(shape, element);

          // register sound on generator
          generator.registerElement(stepNumber, element);

          modeling.connect(shape, element);
        }

      });
    }

    // if musical event
    if (isMusicalEvent(shape)) {

      generators = executor.getAllGenerators();

      // check distance for all generators
      forEach(generators, function(generator) {
        var generatorShape = elementRegistry.get(generator.id);

        if (getDistance(shape, generatorShape) <= MAX_DIST) {

          var stepNumber = generator.calculateStepNumber(shape, generatorShape);

          // register sound on generator
          generator.registerElement(stepNumber, shape);

          modeling.connect(generatorShape, shape);
        }
      }, this);
    }
  }, this);

  eventBus.on('shape.removed', function(context) {
    var element = context.element;

    if (is(element, 'bpmn:StartEvent')) {
      executor.removeGenerator(element.id);
    }

    // if musical event
    if (isMusicalEvent(element)) {

      forEach(self._executor.getAllGenerators(), function(generator) {

        // remove from generator if registered
        console.log('removing from generator');
      });

    }
  }, this);

  eventBus.on('shape.move.end', function(context) {
    var shape = context.shape,
        generators;

    if (isMusicalEvent(shape)) {

      generators = executor.getAllGenerators();

      // check distance for all generators
      forEach(generators, function(generator) {
        var generatorShape = elementRegistry.get(generator.id);

        if (getDistance(shape, generatorShape) <= MAX_DIST) {

          var stepNumber = generator.calculateStepNumber(shape, generatorShape);

          // register sound on generator
          generator.updateElement(stepNumber, shape);
        }
      }, this);
    }
  }, this);

  eventBus.on('elements.changed', function(context) {

    forEach(context.elements, function(element) {
      var newSubDivision,
          generator;

      // if it is a generator
      if (is(element, 'bpmn:StartEvent') && element.type !== 'label') {

        newSubDivision = element.businessObject.subDivision;

        generator = executor.getGenerator(element.id);

        if (generator) {
          generator.updateSubDivision(newSubDivision);
        }
      }
    }, this);

  }, this);
}

module.exports = GeneratorManager;

GeneratorManager.$inject = [ 'eventBus', 'executor', 'elementRegistry', 'modeling' ];


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

  return generator;
};
