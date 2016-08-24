'use strict';

var assign = require('lodash/object/assign');

/**
 * A palette that allows you to create BPMN _and_ custom elements.
 */
function PaletteProvider(palette, create, elementFactory, spaceTool, lassoTool) {

  this._create = create;
  this._elementFactory = elementFactory;
  this._spaceTool = spaceTool;
  this._lassoTool = lassoTool;

  palette.registerProvider(this);
}

module.exports = PaletteProvider;

PaletteProvider.$inject = [ 'palette', 'create', 'elementFactory', 'spaceTool', 'lassoTool' ];


PaletteProvider.prototype.getPaletteEntries = function(element) {

  var actions  = {},
      create = this._create,
      elementFactory = this._elementFactory,
      spaceTool = this._spaceTool,
      lassoTool = this._lassoTool;


  function createAction(type, group, className, title, options) {

    function createListener(event) {
      var shape = elementFactory.createShape(assign({ type: type }, options));

      if (options) {
        shape.businessObject.di.isExpanded = options.isExpanded;
      }

      create.start(event, shape);
    }

    var shortType = type.replace(/^bpmn\:/, '');

    return {
      group: group,
      className: className,
      title: title || 'Create ' + shortType,
      action: {
        dragstart: createListener,
        click: createListener
      }
    };
  }

  function createParticipant(event, collapsed) {
    create.start(event, elementFactory.createParticipantShape(collapsed));
  }

  assign(actions, {
    'lasso-tool': {
      group: 'tools',
      className: 'bpmn-icon-lasso-tool',
      title: 'Activate the lasso tool',
      action: {
        click: function(event) {
          lassoTool.activateSelection(event);
        }
      }
    },
    'space-tool': {
      group: 'tools',
      className: 'bpmn-icon-space-tool',
      title: 'Activate the create/remove space tool',
      action: {
        click: function(event) {
          spaceTool.activateSelection(event);
        }
      }
    },
    'tool-separator': {
      group: 'tools',
      separator: true
    },
    'create.start-event': createAction(
      'bpmn:StartEvent', 'generator', 'bpmn-icon-start-event-message', 'Create Generator', { eventDefinitionType: 'bpmn:MessageEventDefinition' }
    ),
    'generator-separator': {
      group: 'generator',
      separator: true
    },
    'create.error-end-event': createAction(
      'bpmn:EndEvent', 'instrument', 'bpmn-icon-end-event-error', 'Create Instrument A', { eventDefinitionType: 'bpmn:ErrorEventDefinition' }
    ),
    'create.escalation-end-event': createAction(
      'bpmn:EndEvent', 'instrument', 'bpmn-icon-end-event-escalation', 'Create Instrument B', { eventDefinitionType: 'bpmn:EscalationEventDefinition' }
    ),
    'create.signal-end-event': createAction(
      'bpmn:EndEvent', 'instrument', 'bpmn-icon-end-event-signal', 'Create Instrument C', { eventDefinitionType: 'bpmn:SignalEventDefinition' }
    ),
    'create.cancel-end-event': createAction(
      'bpmn:EndEvent', 'instrument', 'bpmn-icon-end-event-cancel', 'Create Instrument D', { eventDefinitionType: 'bpmn:CancelEventDefinition' }
    ),
    'create.compensation-end-event': createAction(
      'bpmn:EndEvent', 'instrument', 'bpmn-icon-end-event-compensation', 'Create Instrument E', { eventDefinitionType: 'bpmn:CompensationEventDefinition' }
    ),
    'instrument-separator': {
      group: 'instrument',
      separator: true
    },
    'create.service-task': createAction(
      'bpmn:ServiceTask', 'drum', 'bpmn-icon-service-task', 'Create Kick Drum'
    ),
    'create.user-task': createAction(
      'bpmn:UserTask', 'drum', 'bpmn-icon-user-task', 'Create Snare Drum'
    ),
    'create.manual-task': createAction(
      'bpmn:ManualTask', 'drum', 'bpmn-icon-manual-task', 'Create Clap'
    ),
    'create.business-rule-task': createAction(
      'bpmn:BusinessRuleTask', 'drum', 'bpmn-icon-business-rule-task', 'Create Closed HiHat'
    ),
    'create.script-task': createAction(
      'bpmn:ScriptTask', 'drum', 'bpmn-icon-script-task', 'Create Open HiHat'
    ),
  });

  return actions;
};