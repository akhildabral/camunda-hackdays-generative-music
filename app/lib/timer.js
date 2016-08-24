'use strict';

var isPlaying = false,
    metronome = false,
    worker;

var bars = 1; // number of bars of 16th notes
var tempo = 120.0;
var nextNoteTime = 0.0;
var current16thNote = 0;
var scheduleAheadTime = 0.1; // seconds

var noteRegistry = {
  0: [],
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
  8: [],
  9: [],
  10: [],
  11: [],
  12: [],
  13: [],
  14: [],
  15: []
};

var notes = {
  C3: 130.81,
  D3: 146.83,
  E3: 164.81,
  F3: 174.61,
  G3: 196.00,
  A3: 220.00,
  H3: 246.94,
  C4: 261.63,
  C4maj: 277.18,
  D4: 293.66,
  D4maj: 311.13,
  E4: 329.63,
  F4: 349.23,
  F4maj: 369.99,
  G4: 392.00,
  G4maj: 415.30,
  A4: 440.00,
  A4maj: 466.16,
  H4: 493.88
};

function addNote(sixteenth, note) {
  noteRegistry[sixteenth].push(note);
}

function init() {

  // if we want crazy rendering stuff we kick of this loop
  // window.requestAnimationFrame(tick);

  worker = new Worker("lib/worker.js");

  worker.onmessage = function(e) {

    // run scheduler
    if (e.data === 'tick') {
        scheduler();
    }
  };

}

function nextNote() {
  var secondsPerBeat = 60.0 / tempo; // change tempo to change tempo

  nextNoteTime += 0.25 * secondsPerBeat;

  current16thNote++;

  if (current16thNote === 16 * bars) {
      current16thNote = 0;
  }

  console.log('current16thNote: ' + current16thNote);
}

function scheduler() {

  // look ahead
  while (nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
      if (metronome) {

        // schedule metronome note for every 16th note
        scheduleMetronomeNote(current16thNote, nextNoteTime);
      }

      // schedule notes if any are registered for the current 16th note
      if (noteRegistry[current16thNote].length) {
        noteRegistry[current16thNote].forEach(function(note) {
          schedulePatchNote(note.frequency, note.patch, nextNoteTime);
        });
      }

      nextNote();
  }

}

function scheduleMetronomeNote(current16thNote, time) {

  // create oscillator
  var osc = audioContext.createOscillator();
  var gain = audioContext.createGain();

  gain.gain.value = 0.3;

  osc.connect(gain);
  gain.connect(audioContext.destination);

  if (current16thNote === 0) {
    osc.frequency.value = 880.0;
  } else {
    osc.frequency.value = 440.0;
  }

  osc.start(time);
  osc.stop(time + 0.1);
}

function scheduleSimpleNote(frequency, time) {

  // create oscillator
  var osc = audioContext.createOscillator();
  var gain = audioContext.createGain();

  osc.frequency.value = frequency;
  osc.type = 'sawtooth';

  gain.gain.value = 0.3;

  osc.connect(gain);
  gain.connect(audioContext.destination);

  osc.start(time);
  osc.stop(time + 0.1);
}

function schedulePatchNote(frequency, patch, time) {
  patch.oscillator.setFrequencyAt(frequency, time);

  patch.envelope.triggerAt(time);
}

function tick() {

  var currentTime = audioContext.currentTime;

  // we could do all sorts of rendering stuff here

  requestAnimationFrame(tick);
}

function play() {
  isPlaying = !isPlaying;

  if (isPlaying) {
    worker.postMessage('start');
  } else {
    worker.postMessage('stop');
  }
}

init();

// add notes
// impulse is generated at 0
// near node would be scheduled at 1 or maybe 2
// far node would be scheduled at 14 or maybe 15
// 1 note would be one node near to the generator

addNote(10, { frequency: notes.C4, patch: patches['simple'] });
addNote(10, { frequency: notes.E4, patch: patches['simple'] }); // TODO add polyphony

addNote(12, { frequency: notes.E4, patch: patches['simple'] });

addNote(13, { frequency: notes.G4, patch: patches['simple'] });

// UI
var buttonPlay = document.getElementById('play');

buttonPlay.addEventListener('click', function() {
  play();
});
