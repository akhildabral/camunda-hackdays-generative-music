'use strict';

var inherits = require('inherits');

var PropertiesActivator = require('bpmn-js-properties-panel/lib/PropertiesActivator');

// Require your custom property entries.
var intervalProps = require('./parts/IntervalProps'),
    tempoProps = require('./parts/TempoProps');

function createSettingsTabGroups(element, elementRegistry) {

  var generalGroup = {
    id: 'general',
    label: 'General',
    entries: []
  };

  intervalProps(generalGroup, element);
  tempoProps(generalGroup, element);


  return [
    generalGroup
  ];
}

function MusicPropertiesProvider(eventBus, bpmnFactory, elementRegistry) {

  PropertiesActivator.call(this, eventBus);

  this.getTabs = function(element) {

    var settingsTab = {
      id: 'settings',
      label: 'Settings',
      groups: createSettingsTabGroups(element, elementRegistry)
    };

    return [
      settingsTab
    ];
  };
}

inherits(MusicPropertiesProvider, PropertiesActivator);

module.exports = MusicPropertiesProvider;
