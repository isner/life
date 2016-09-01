/* globals document */
'use strict';

var Emitter = require('component/emitter');
var dataset = require('code42day/dataset');
var classes = require('component/classes');
var events = require('component/events');
var config = require('../config.json');

module.exports = World;

function World(el) {
  // TODO don't require a specific `el` with specific styles
  this.el = el;
  this.cells = [];
  this.generation = 0;
  // TODO construct the counter - make modular
  this.counter = document.querySelector('#counter .count');
}

Emitter(World.prototype);

World.prototype.register = function (cell) {
  this.cells.push(cell);
  // seed world
  if ([1,2,3,4,5,6,7,92,93,94,95,96,97,98].indexOf(cell.n) >= 0) {
    cell.live();
  }
  return this;
};

World.prototype.start = function () {
  var world = this;
  console.log('World started with configuration:\n' + world.getBinary());

  world.cycle = setInterval(() => {
    world.generation++;
    var cells = world.cells;
    var initState = world.getBinary();

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

    var endBin = cells.reduce((prev, curr) => {
      return curr.status == 'alive' ? prev + '1' : prev + '0';
    }, '');

    if (initState == world.getBinary()) {
      world.stop();
    }

  }, config.speed);
  return this;
};

World.prototype.getBinary = function () {
  return this.cells.reduce((prev, curr) => {
    return curr.status == 'alive' ? prev + '1' : prev + '0';
  }, '');
};

World.prototype.stop = function () {
  clearInterval(this.cycle);
  console.log('World stopped after ' + this.generation + ' generation(s)');
  return this;
};
