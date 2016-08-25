'use strict';

var forEach = require('lodash/collection/forEach'),
    find = require('lodash/collection/find');


function Executor(eventBus, audioContext, soundMachine) {
  this._eventBus = eventBus;
  this._audioContext = audioContext;
  this._soundMachine = soundMachine;

  this._generators = {};

  this._steps = {};

  eventBus.on('master-clock.start', function(context) {
    var numSteps = context.numSteps,
        idx;

    this._steps.length = numSteps;

    for (idx; idx < numSteps; idx++) {
      this._steps[idx] = [];
    }
  }, this);

  eventBus.on('master-clock.tick', function(context) {
    // trigger sounds
    this.trigger(context.tick, context.nextNoteTime);
  }, this);
}

module.exports = Executor;

Executor.$inject = [ 'eventBus', 'audioContext', 'soundMachine' ];


Executor.prototype.registerGenerator = function(generator) {
  this._generators[generator.id] = generator;
};

Executor.prototype.getGenerator = function(generator) {
  if (typeof id === 'string') {
    return this._generators[generator];
  }

  return this._generators[generator.id];
};

Executor.prototype.getAllGenerators = function() {
  return this._generators;
};

Executor.prototype.removeGenerator = function(id) {
  delete this._generators[id];
};

Executor.prototype.trigger = function(tick, nextNoteTime) {
  var soundMachine = this._soundMachine;

  var generators = this.getAllGenerators(),
      sounds = [];

  forEach(generators, function(generator) {
    var step = generator.getStep(tick);

    if (step && step.length) {
      sounds = sounds.concat(step);
    }
  });

  soundMachine.playPatches(sounds, nextNoteTime);
};
