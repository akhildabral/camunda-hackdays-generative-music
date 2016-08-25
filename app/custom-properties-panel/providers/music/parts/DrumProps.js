'use strict';

var forEach = require('lodash/collection/forEach');

var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory');

var is = require('bpmn-js/lib/util/ModelUtil').is;

module.exports = function(group, element) {

  if (is(element, 'bpmn:Task')) {

    var sounds = window.bpmnjs.get('soundMachine').getSounds('drums');

    var selectOptions = [ { name: '', value: '' } ];

    forEach(sounds, function(sound, key) {
      selectOptions.push({ name: sound.label, value: key });
    });

    var selectBox = entryFactory.selectBox({
      id : 'preset',
      description : 'Select a preset',
      label : 'Preset',
      modelProperty : 'preset',
      selectOptions: selectOptions
    });

    group.entries.push(selectBox);

  }
};