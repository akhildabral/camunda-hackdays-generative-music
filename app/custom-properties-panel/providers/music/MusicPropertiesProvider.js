'use strict';

var inherits = require('inherits');

var PropertiesActivator = require('bpmn-js-properties-panel/lib/PropertiesActivator');

// Require your custom property entries.
var processProps = require('./parts/ProcessProps'),
    generatorProps = require('./parts/GeneratorProps');

function createSettingsTabGroups(element, elementRegistry) {

  var generalGroup = {
    id: 'general',
    label: 'General',
    entries: []
  };

  processProps(generalGroup, element);
  generatorProps(generalGroup, element);

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
