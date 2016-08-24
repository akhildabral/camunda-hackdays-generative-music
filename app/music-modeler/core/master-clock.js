'use strict';

var STEPS_NUM = 64 // this is the same as 4 bars

function MasterClock(eventBus) {
  this._eventBus = eventBus;

  this._ticks = {};
  this._isPlaying = false;


  eventBus.on('import.done', function() {
    this.resetTicks();

    console.log(this._ticks);
  }, this);
}

module.exports = MasterClock;

MasterClock.$inject = [ 'eventBus' ];

MasterClock.prototype.resetTicks = function() {
  var steps = STEPS_NUM,
      i = 0;

  for (i; i < steps; i++) {
    this._ticks[i] = [];
  }
};

MasterClock.prototype.init = function() {
  var worker = this.worker = new Worker("lib/worker.js");

  worker.onmessage = function(e) {

    // run scheduler
    if (e.data === 'tick') {
        scheduler();
    }
  };

  this.resetTicks();
};
