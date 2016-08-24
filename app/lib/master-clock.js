'use strict';


function MasterClock() {
  this._ticks = {};
}



MasterClock.prototype.resetTicks = function() {
  var steps = 16,
      i = 0;

  for (i; i < steps; i++) {
    this._ticks[i] = [];
  }
}

MasterClock.prototype.init = function() {
  var steps = 16,
      i = 0;

  for (i; i < steps; i++) {
    this._ticks[i] = [];
  }
}
