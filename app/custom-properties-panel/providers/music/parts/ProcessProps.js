'use strict';

var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory');

var domAttr = require('min-dom/lib/attr'),
    domQuery = require('min-dom/lib/query');

var is = require('bpmn-js/lib/util/ModelUtil').is;

function getHTML(id, label) {
  return '<label for="camunda-'+ id +'">'+ label +'</label>' +
    '<input id="camunda-'+ id +'" type="text" name="'+ id +'" />' +
    '<button class="plusMinusButton" data-action="change" style="position: relative;">-</button>' +
    '<button class="plusMinusButton" data-action="change" style="position: relative; display: inline-block">+</button>';
}

function change(element, node, event) {
  var input = domQuery('input', node);

  var operator = event.delegateTarget.innerHTML;

  if (input.value !== '') {
    var value = parseInt(input.value);

    if (value > 0) {

      var newValue;

      if (operator === '+') {
        newValue = value + 1;
      } else if (operator === '-') {
        newValue = value === 1 ? value : value - 1;
      }
      input.value = newValue;

      return true;
    }
  }
}

module.exports = function(group, element) {

  if (is(element, 'bpmn:Process')) {
    var tempoTextField = entryFactory.textField({
      id : 'tempo',
      description : 'Specify the overall tempo in BPM',
      label : 'Tempo',
      modelProperty : 'tempo'
    });

    tempoTextField.change = change;
    tempoTextField.html = getHTML('tempo', 'Tempo');

    group.entries.push(tempoTextField);

    var volumeTextField = entryFactory.textField({
      id : 'volume',
      description : 'Specify the main volume',
      label : 'Volume',
      modelProperty : 'volume',
    });

    volumeTextField.change = change;
    volumeTextField.html = getHTML('volume', 'Volume');

    group.entries.push(volumeTextField);
  }
};