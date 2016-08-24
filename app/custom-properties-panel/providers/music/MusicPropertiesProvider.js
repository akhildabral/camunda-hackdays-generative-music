'use strict';

var inherits = require('inherits');

var PropertiesActivator = require('bpmn-js-properties-panel/lib/PropertiesActivator');

// Require your custom property entries.
var intervalProps = require('./parts/IntervalProps');

// Create the custom magic tab
function createMagicTabGroups(element, elementRegistry) {

  // Create a group called "Black Magic".
  var blackMagicGroup = {
    id: 'timing',
    label: 'Timing',
    entries: []
  };

  // Add the spell props to the black magic group.
  intervalProps(blackMagicGroup, element);

  return [
    blackMagicGroup
  ];
}

function MagicPropertiesProvider(eventBus, bpmnFactory, elementRegistry) {

  PropertiesActivator.call(this, eventBus);

  this.getTabs = function(element) {

    // The "magic" tab
    var magicTab = {
      id: 'settings',
      label: 'Settings',
      groups: createMagicTabGroups(element, elementRegistry)
    };

    // Show general + "magic" tab
    return [
      magicTab
    ];
  };
}

inherits(MagicPropertiesProvider, PropertiesActivator);

module.exports = MagicPropertiesProvider;
