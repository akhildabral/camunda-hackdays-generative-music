'use strict';

var Snap = require('diagram-js/vendor/snapsvg');

var forEach = require('lodash/collection/forEach');

function Token(eventBus, audioContext, canvas, executor, elementRegistry, masterClock) {
  this._audioContext = audioContext;
  this._executor = executor;
  this._elementRegistry = elementRegistry;
  this._masterClock = masterClock;

  this._layer = canvas.getDefaultLayer().group();

  var self = this;

  eventBus.on('master-clock.next-note', function(context) {

    if (context.currentNote === 0) {

      // reset
      self._layer.clear();

      setTimeout(function() {

        forEach(self._executor.getAllGenerators(), function(generator) {
          var generatorShape = self._elementRegistry.get(generator.id);

          var circle = self._layer.circle(
            generatorShape.x + generatorShape.width / 2,
            generatorShape.y + generatorShape.height / 2,
            1).attr({
              fill: "#00f",
              strokeWidth: 0,
              fillOpacity: 0.5,
              pointerEvents: 'none'
          });

          var loopLengthInSeconds = 60 / self._masterClock._tempo * 4;

          circle.animate({ r: 600, opacity: 0 }, loopLengthInSeconds * 1000);

        });

      }, context.nextNoteTime - self._audioContext.currentTime);
    }

  });

}

Token.$inject = [ 'eventBus', 'audioContext', 'canvas', 'executor', 'elementRegistry', 'masterClock' ];

module.exports = Token;
