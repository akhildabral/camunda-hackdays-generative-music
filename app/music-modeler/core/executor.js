'use strict';

function Executor(eventBus, audioContext) {
  this._eventBus = eventBus;
  this._audioContext = audioContext;

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

Executor.$inject = [ 'eventBus', 'audioContext' ];


Executor.prototype.register = function(id, generator) {
  this._generators[id] = generator;
};

Executor.prototype.getGenerator = function(id) {
  return this._generators[id];
};

Executor.prototype.getAllGenerators = function() {
  return this._generators;
};

Executor.prototype.removeGenerator = function(id) {
  delete this._generators[id];
};

Executor.prototype.trigger = function(tick, nextNoteTime) {
  // var soundMachine = this._soundMachine;
  //
  // var patches = this._steps[tick];

  // soundMachine.playPatches(patches, nextNoteTime);
};

/**
 * @example
 *
 * sounds: [
 *   {
 *     stepNumber: 4,
 *     patch: { audio descriptor }
 *   },
 *   {
 *     stepNumber: 8,
 *     patch: { audio descriptor }
 *   },
 *   {
 *     stepNumber: 10,
 *     patch: { audio descriptor }
 *   },
 * ]
 *
 *
 * this._steps = {
 *  4: [
 *    { audio descriptor },
 *    { audio descriptor }
 *  ]
 * }
 *
 * @method registerSounds
 */
Executor.prototype.updateSchedule = function(sounds) {
  var stepsLen = this._steps.length,
      idx;

  for (idx; idx < stepsLen; idx++) {
    this._steps[idx] = idx;
  }
};
