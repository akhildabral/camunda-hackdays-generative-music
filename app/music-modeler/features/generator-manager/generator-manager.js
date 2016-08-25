'use strict';

var find = require('lodash/collection/find');

var is = require('bpmn-js/lib/util/ModelUtil');

var Generator = require('./generator');

var DEFAULT_DIVISION = 4; // just need divider coz: 1 / n

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
function GeneratorManager(eventBus, executor) {
  this._eventBus = eventBus;
  this._executor = executor;

  eventBus.on('master-clock.start', function(context) {
    var numSteps = context.numSteps;

    this._numSteps = numSteps;
  }, this);

  eventBus.on('create.end', function(context) {
    var shape = context.shape;

    if (!this.exists(shape) && is('bpmn:StartEvent')) {
      this.createNewGenerator(shape);
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

    // if shape doesn't surpass the max length
    this.registerSound(shape);
  }, this);

  eventBus.on('move.end', function(context) {
    var shape = context.shape;

    var generator = this.findGenerator(shape),
        sounds;

    if (!generator) {
      return;
    }

    sounds = generator.update(shape);

    executor.updateSchedule(sounds);
  }, this);

  // custom event when properties are updated
  eventBus.on('properties.update', function(context) {
    var newSubDivision = context.newSubDivision,
        id = context.id,
        sounds;

    var generator = executor.getGenerator(id);

    if (generator) {
      sounds = generator.updateSubDivision(newSubDivision);

      executor.updateSchedule(sounds);
    }
  }, this);
}

module.exports = GeneratorManager;

GeneratorManager.$inject = [ 'eventBus', 'executor' ];


GeneratorManager.prototype.findGenerator = function(shape) {
  var executor = this._executor;

  var generators = executor.getAllGenerators();

  return find(generators, function(generator) {
    return generator.outgoing.indexOf(shape);
  });
};

GeneratorManager.prototype.exists = function(shape) {
  return !!this._generators[shape.id];
};

GeneratorManager.prototype.createNewGenerator = function(shape) {
  var executor = this._executor;

  var numSteps = this._numSteps;

  var generator = new Generator(numSteps, DEFAULT_DIVISION);

  executor.registerGenerator(shape.id, generator);
};
