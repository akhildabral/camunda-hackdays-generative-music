'use strict';

var Snap = require('diagram-js/vendor/snapsvg');

var forEach = require('lodash/collection/forEach');

function Token(eventBus, audioContext, canvas, executor, elementRegistry, masterClock) {
  this._audioContext = audioContext;
  this._executor = executor;
  this._elementRegistry = elementRegistry;

  this._layer = canvas.getDefaultLayer().group();

  this._tokens = [];

  var self = this;

  eventBus.on('master-clock.next-note', function(context) {

    if (context.currentNote === 0) {

      // reset
      self._layer.clear();
      self._tokens = [];

      setTimeout(function() {

        forEach(self._executor.getAllGenerators(), function(generator) {
          var generatorShape = self._elementRegistry.get(generator.id);

          forEach(generatorShape.outgoing, function(connection) {

            var targetShape = connection.target;

            var circle = self._layer.circle(
              generatorShape.x + generatorShape.width / 2,
              generatorShape.y + generatorShape.height / 2,
              10).attr({
                fill: "#f00",
                strokeWidth: 0,
                fillOpacity: 0.5
            });

            this._tokens.push({
                gfx: circle,
                targetShape: { x: targetShape.x, y: targetShape.y }
            });

          });

        });

      }, context.nextNoteTime - self._audioContext.currentTime);
    }

  });

  eventBus.on('master-clock.tick', function(context) {
    var tempo = masterClock._tempo;
    

  });

}

Token.$inject = [ 'eventBus', 'audioContext', 'canvas', 'executor', 'elementRegistry', 'masterClock' ];

module.exports = Token;
