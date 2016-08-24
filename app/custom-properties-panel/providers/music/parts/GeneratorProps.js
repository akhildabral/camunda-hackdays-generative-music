'use strict';

var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory');

var is = require('bpmn-js/lib/util/ModelUtil').is;

module.exports = function(group, element) {


  if (is(element, 'bpmn:StartEvent')) {
    group.entries.push(entryFactory.selectBox({
      id : 'interval',
      description : 'Specify the interval an impule is generated',
      label : 'Interval',
      modelProperty : 'interval',
      selectOptions: [
        { name: '3/4', value: '3/4' },
        { name: '4/4', value: '4/4' },
        { name: '7/8', value: '7/8' },
        { name: '8/8', value: '8/8' }
      ]
    }));
  }
};