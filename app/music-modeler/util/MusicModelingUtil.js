'use strict';

module.exports.isMusicalEvent = function(element) {
  return (element.type === 'bpmn:EndEvent' || element.type === 'bpmn:Task');
};
