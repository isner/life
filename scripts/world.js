/* globals document */
'use strict';

var Emitter = require('component/emitter');
var dataset = require('code42day/dataset');
var classes = require('component/classes');
var events = require('component/events');

module.exports = World;

function World(el) {
  this.el = el;
  this.cells = {};
}

Emitter(World.prototype);

World.prototype.register = function (cell) {
  this.cells[cell.n] = cell;

  // seed world
  if (cell.n === 50) cell.live();

  return this;
};

World.prototype.tick = function () {
  var cells = this.cells;
  this.cells.forEach(cell => {

    var living = [
      cell.n - 11, cell.n - 10, cell.n - 9, cell.n - 1,
      cell.n + 1, cell.n + 9, cell.n + 10, cell.n + 11
    ].map(pos => {
      var cell = cells[pos];
      return cell && cell.status == 'alive' ? 1 : 0;
    }).reduce((prev, curr) => {
      prev += curr;
    }, 0);

    if (cell.status == 'alive') {
      if (living < 2) {
        cell.die(); // underpopulation
      }
      else if (living >= 2 && living <= 3) {
        cell.live(); // survival
      }
      else if (living > 3) {
        cell.die(); // overpopulation
      }
    }
    else {
      if (living === 3) {
        cell.live(); // reproduction
      }
    }

  });
};

World.prototype.start = function () {
  this.time = setTimeout(this.tick, 250);
  return this;
};

World.prototype.stop = function () {
  this.time = null;
  return this;
};
