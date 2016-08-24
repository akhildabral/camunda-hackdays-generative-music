'use strict';

var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory');

var is = require('bpmn-js/lib/util/ModelUtil').is;

module.exports = function(group, element) {


  if (is(element, 'bpmn:StartEvent')) {
    group.entries.push(entryFactory.selectBox({
      id : 'timeDivision',
      description : 'Specify the time division',
      label : 'Time Division',
      modelProperty : 'timeDivision',
      selectOptions: [
        { name: '1/1', value: '1/1' },
        { name: '1/2', value: '1/2' },
        { name: '1/4', value: '1/4' },
        { name: '1/8', value: '1/8' }
      ]
    }));
  }
};