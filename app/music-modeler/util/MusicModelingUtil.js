'use strict';

var is = require('bpmn-js/lib/util/ModelUtil').is;

module.exports.isMusicalEvent = function(element) {
  return (is(element, 'bpmn:EndEvent') || is(element, 'bpmn:Task'));
};
