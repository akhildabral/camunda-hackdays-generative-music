'use strict';

var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory');

var is = require('bpmn-js/lib/util/ModelUtil').is;

module.exports = function(group, element) {

  if (is(element, 'bpmn:Task')) {
    group.entries.push(entryFactory.selectBox({
      id : 'preset',
      description : 'Select a preset',
      label : 'Preset',
      modelProperty : 'preset',
      selectOptions: [
        { name: 'Foo', value: 'foo' },
        { name: 'Bar', value: 'bar' },
        { name: 'Baz', value: 'baz' },
      ]
    }));
  }
};