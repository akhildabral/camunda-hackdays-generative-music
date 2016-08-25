'use strict';

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
function Generator(eventBus, executor) {
  this._eventBus = eventBus;
  this._executor = executor;

  this._steps = {
    changed: []
  };

  this._subDivision = DEFAULT_DIVISION;

  eventBus.on('master-clock.start', function(context) {
    var numSteps = context.numSteps;

    this.init(numSteps);
  }, this);

  eventBus.on('create.end', function(context) {
    var shape = context.shape;

    // if shape doesn't surpass the max length
    this.registerSound(shape);
  }, this);

  eventBus.on('move.end', function(context) {
    var shape = context.shape;

    // if shape doesn't surpass the max length
    this.updateSound(shape);
  }, this);
}

module.exports = Generator;

Generator.$inject = [ 'eventBus', 'executor' ];

/**
 * full: [ 0 ],
 * half: [ 0, 8 ],
 * quarter: [ 0, 4, 8, 12 ],
 * eigth: [ 0, 2, 4, 6, 8, 10, 12 ],
 * sixteenth: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ]
 *
 * @param  {Number} numSteps
 */
Generator.prototype.init = function(numSteps) {
  var divider = numSteps / DEFAULT_DIVISION;

  this._steps = {
    changed: []
  };

  this._numSteps = numSteps;

  this.loopSteps(divider, function(step, index) {
    this._steps[index] = [];
  });
};

Generator.prototype.loopSteps = function(divider, fn) {
  for (var idx = 0; idx < this._numSteps; idx++) {
    if (idx % divider === 0) {
      fn.call(this, this._steps[idx], idx);
    }
  }
};

/**
 * Updates the subdivision by moving sounds accordingly to their new steps depending
 * if the subdivision was increased or decreased.
 *
 * @param  {Number} newSubDivision
 *
 * @return {Sounds}
 */
Generator.prototype.updateSubDivision = function(newSubDivision) {
  var divider = this._numSteps / newSubDivision,
      oldDivider = this._numSteps / this._subDivision,
      isSmaller = newSubDivision > this._subDivision,
      newSteps = {
        changed: []
      },
      stepCounter = 0,
      idx;

  if (newSubDivision === this._subDivision) {
    return;
  }

  // update new subdivision
  this._subDivision = newSubDivision;

  // from 1/4 to 1/8 - no need to move sounds around
  if (isSmaller) {
    this.loopSteps(divider, function(step, index) {
      if (!step) {
        this._steps[index] = [];
      }
    });

    return this._steps;
  }

  this.loopSteps(divider, function(step, index) {
    newSteps[index] = [];
  });

  this.loopSteps(oldDivider, function(step, index) {
    // update the stepCounter whenever the index passes (divider * stepCounter + 1)
    if (index >= divider * (stepCounter + 1)) {
      stepCounter += 1;
    }

    if (step.length) {
      if (newSteps[index]) {
        newSteps[index] = step;
      } else {
        for (idx = 0; idx < step.length; idx++) {
          this._insertSound(newSteps, divider * stepCounter, step[idx]);
        }
      }
    }
  });

  this._steps = newSteps;

  return this._steps;
};

/**
 * {
 *  preset: 'simple-mode',
 *  note: 'a1'
 * }
 *
 * @method getPatch
 *
 * @return {Object}
 */
Generator.prototype.getPatch = function(shape) {
  // fetch patch from the businessObject
};

Generator.prototype.calculateStepNumber = function(shape) {

};

Generator.prototype.registerSound = function(shape) {
  var sound = this.getPatch(shape);

  var stepNumber = this.calculateStepNumber(shape);

  this._insertSound(this._steps, stepNumber, sound);
};

Generator.prototype.scheduleSounds = function() {
  var executor = this._executor;

  var sounds = {},
      steps = this._steps,
      divider;

  if (!steps.changed.length) {
    return;
  }

  divider = this._numSteps / this._subDivision;

  this.loopSteps(divider, function(step, index) {
    if (steps.changed.indexOf(index) !== -1) {
      sounds[index] = step;
    }
  });

  // reset changed
  steps.changed = [];

  executor.updateSchedule(sounds);

  return sounds;
};

Generator.prototype._insertSound = function(steps, stepNumber, sound) {
  steps[stepNumber].push(sound);

  if (steps.changed.indexOf(stepNumber) === -1) {
    steps.changed.push(parseInt(stepNumber, 10));
  }
};
