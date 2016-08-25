'use strict';

var find = require('lodash/collection/find');

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
function Generator(numSteps, subDivision) {
  this._steps = {
    changed: []
  };

  this._subDivision = subDivision;

  this.init(numSteps, subDivision);
}

module.exports = Generator;

/**
 * full: [ 0 ],
 * half: [ 0, 8 ],
 * quarter: [ 0, 4, 8, 12 ],
 * eigth: [ 0, 2, 4, 6, 8, 10, 12 ],
 * sixteenth: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ]
 *
 * @param  {Number} numSteps
 */
Generator.prototype.init = function(numSteps, subDivision) {
  var divider = numSteps / subDivision;

  this._steps = {
    changed: []
  };

  this._numSteps = numSteps;

  this.loopSteps(divider, function(step, index) {
    this._steps[index] = [];
  });
};

Generator.prototype.loopSteps = function(divider, fn) {
  var result;

  for (var idx = 0; idx < this._numSteps; idx++) {
    if (idx % divider === 0) {
      result = fn.call(this, this._steps[idx], idx);

      if (result === false) {
        break;
      }
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
      stepCounter = 0;

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
        newSteps[divider * stepCounter] = newSteps[divider * stepCounter].concat(step);
      }
    }
  });

  this._steps = newSteps;

  return this._steps;
};

/**
 * {
 *  preset: 'simple-mode',
 *  note: 'a1',
 *  id: 'foo-bar'
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

  this._insertSound(stepNumber, sound);
};

Generator.prototype.update = function(shape) {
  var sound = this.getPatch(shape);

  var stepNumber = this.calculateStepNumber(shape);

  this.moveSound(stepNumber, sound);

  return this.getSchedule();
};

/**
 * Moves sound to a new step number.
 *
 * @method moveSound
 *
 * @param  {[type]}  newStepNumber [description]
 * @param  {[type]}  sound         [description]
 *
 * @return {[type]}                [description]
 */
Generator.prototype.moveSound = function(newStepNumber, sound) {
  var removeIdx;

  this.loopSteps(function(step, stepIndex) {
    if (find(step, { id: sound.id })) {
      removeIdx = stepIndex;

      return false;
    }
  });

  if (typeof removeIdx === 'number') {
    this.removeSound(removeIdx, sound);
  }

  this._insertSound(newStepNumber, sound);
};

Generator.prototype.removeSound = function(stepIndex, sound) {
  var step = this._steps[stepIndex],
      currSound,
      currIndex;

  if (step) {
    currSound = find(step, { id: sound.id });
    currIndex = step.indexOf(currSound);

    step.splice(currIndex, 1, sound);
  }
};

Generator.prototype.getSchedule = function() {
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

  return sounds;
};

Generator.prototype._insertSound = function(stepNumber, sound) {
  this._steps[stepNumber].push(sound);

  if (this._steps.changed.indexOf(stepNumber) === -1) {
    this._steps.changed.push(parseInt(stepNumber, 10));
  }
};