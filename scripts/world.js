/* globals document */
'use strict';

var Emitter = require('component/emitter');
var dataset = require('code42day/dataset');
var classes = require('component/classes');
var events = require('component/events');
var config = require('../config.json');

module.exports = World;

function World(el) {
  this.el = el;
  this.cells = [];
  this.generation = 0;
  this.counter = document.getElementById('counter');
}

Emitter(World.prototype);

World.prototype.register = function (cell) {
  this.cells.push(cell);
  // seed world
  if ([1,3,4,6,7,8,9,10,12,13,15,40,41,50,51,53].indexOf(cell.n) >= 0) {
    cell.live();
  }
  return this;
};

World.prototype.start = function () {
  var world = this;

  world.time = setInterval(() => {
    world.generation++;
    var cells = world.cells;

    cells.forEach((cell, i) => {
      var living = [
        cells[i-11], cells[i-10], cells[i-9], cells[i-1],
        cells[i+1], cells[i+9], cells[i+10], cells[i+11]
      ].map(neighbor => {
        return neighbor && neighbor.status == 'alive' ? 1 : 0;
      }).reduce((prev, curr) => {
        return prev + curr;
      });

      if (cell.status == 'alive') {
        if (living < 2) {
          cell.queue('die'); // underpopulation
        }
        else if (living >= 2 && living <= 3) {
          cell.queue('live'); // survival
        }
        else if (living > 3) {
          cell.queue('die'); // overpopulation
        }
      }
      else if (cell.status == 'dead' && living === 3) {
        cell.queue('live'); // reproduction
      }
      else {
        var fate = cell.status == 'alive' ? 'live' : 'die';
        cell.queue(fate);
      }
    });

    cells.forEach(cell => {
      cell[cell.fate]();
    });

    world.counter.innerHTML = world.generation;

  }, config.speed);
  return this;
};

World.prototype.stop = function () {
  this.time = null;
  return this;
};
