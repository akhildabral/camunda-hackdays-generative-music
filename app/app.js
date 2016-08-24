'use strict';

var CustomModeler = require('./custom-modeler');

var modeler = new CustomModeler({
  container: '#canvas',
  keyboard: { bindTo: document }
});

window.bpmnjs = modeler;
