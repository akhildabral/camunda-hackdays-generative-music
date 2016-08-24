'use strict';

var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory');

var is = require('bpmn-js/lib/util/ModelUtil').is;

module.exports = function(group, element) {


  if (is(element, 'bpmn:Process')) {
    group.entries.push(entryFactory.textField({
      id : 'tempo',
      description : 'Specify the overall tempo in BPM',
      label : 'Tempo',
      modelProperty : 'tempo'
    }));
  }
};