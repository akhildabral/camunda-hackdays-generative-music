'use strict';

module.exports.getDistance = function(shape1, shape2) {
  var pos1 = { x: shape1.x, y: shape1.y },
      pos2 = { x: shape2.x, y: shape2.y };

  var a = pos1.x - pos2.x,
      b = pos1.y - pos2.y;

  return Math.sqrt(a * a + b * b);
};
