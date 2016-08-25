'use strict';

var is = require('bpmn-js/lib/util/ModelUtil').is;

var domQuery = require('min-dom/lib/query'),
    domAttr = require('min-dom/lib/attr');

var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory');

module.exports = function(group, element) {

  if (is(element, 'bpmn:EndEvent')) {

    group.entries.push(entryFactory.selectBox({
      id : 'preset',
      description : 'Select a preset',
      label : 'Preset',
      modelProperty : 'preset',
      selectOptions: [
        { name: 'Bli', value: 'bli' },
        { name: 'Bla', value: 'bla' },
        { name: 'Blub', value: 'blub' },
      ]
    }));


    var id = 'music-note',
        label = 'music-note';

    var resource = { id: id, label: label };

    resource.html = '<label for="camunda-preset">Note</label>' +
    '<div id="keyboard">' +
      '<div type="flat" id="C2"></div>' +
      '<div type="sharp" id="C2s"></div>' +
      '<div type="flat" id="D2"></div>' +
      '<div type="sharp" id="D2s"></div>' +
      '<div type="flat" id="E2"></div>' +
      '<div type="flat" id="F2"></div>' +
      '<div type="sharp" id="F2s"></div>' +
      '<div type="flat" id="G2"></div>' +
      '<div type="sharp" id="G2s"></div>' +
      '<div type="flat" id="A2"></div>' +
      '<div type="sharp" id="A2s"></div>' +
      '<div type="flat" id="H2"></div>' +
      '<div type="flat" id="C3"></div>' +
      '<div type="sharp" id="C3s"></div>' +
      '<div type="flat" id="D3"></div>' +
    '</div>';

    resource.get = function(entry, node) {
      var note = entry.businessObject.get('note');

      if (note && node) {
        var noteNode = domQuery('#'+note, node);

        var activeNodes = domQuery('.active', node);

        if (activeNodes) {
          domAttr(activeNodes, 'class', '');
        }

        if (noteNode) {
          domAttr(noteNode, 'class', 'active');
        }
      }

    };

    group.entries.push(resource);
  }
};