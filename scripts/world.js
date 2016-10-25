/* globals document */
'use strict';

var Emitter = require('component/emitter');
var dataset = require('code42day/dataset');
var classes = require('component/classes');
var events = require('component/events');
var config = require('../config.json');

var ACTIVE = 'active';
var LIVE = 'live';
var DIE = 'die';
var D = config.dimensions;

module.exports = World;

function World(el) {
  // TODO construct this element
  this.el = el;
  this.cells = [];
  this.generation = 0;
  this.active = false;
  // TODO construct these elements
  this.counter = document.querySelector('#controls .count');
  this.startBtn = document.querySelector('#controls .start');
  this.edges = {
    top: new Array(D).fill(0).map(function (n, i) { return i; }),
    bottom: new Array(D).fill(0).map(function (n, i) { return (D*D-D)+i; }),
    left: new Array(D).fill(0).map(function (n, i) { return i*D; }),
    right: new Array(D).fill(0).map(function (n, i) { return (i*D-1)+D; }),
  };
}

Emitter(World.prototype);

World.prototype.register = function (cell) {
  var world = this;

  world.cells.push(cell);

  cell.on('clicked', function () {
    if (!world.isActive()) cell.toggle();
  });

  // random default seed
  if (Math.random() > 0.7) cell.live();
  // if (~config.seed.indexOf(cell.n)) cell.live();

  return this;
};

World.prototype.isActive = function () {
  return this.active;
};

World.prototype.start = function () {
  var world = this;
  var cells = world.cells;

  world.active = true;
  world.startBtn.setAttribute('disabled', 'true');
  classes(world.el).add('active');

  console.log('World started');

  world.cycleId = setInterval(cycle, config.speed);

  function cycle() {
    world.generation++;
    var initState = world.getBinary();

    cells.forEach((cell, cIndex) => {
      var neighbors = [
        cIndex-(D+1),
        cIndex-D,
        cIndex-(D-1),
        cIndex-1,
        cIndex+1,
        cIndex+(D-1),
        cIndex+D,
        cIndex+(D+1)
      ].map((n, nIndex) => {
        if (~world.edges.left.indexOf(cIndex)) {
          if (~[0,3,5].indexOf(nIndex)) {
            return n+D;
          }
        }
        if (~world.edges.right.indexOf(cIndex)) {
          if (~[2,4,7].indexOf(nIndex)) {
            return n-D;
          }
        }
        if (~world.edges.top.indexOf(cIndex)) {
          if (~[0,1,2].indexOf(nIndex)) {
            return (D*D)-Math.abs(n);
          }
        }
        if (~world.edges.bottom.indexOf(cIndex)) {
          if (~[5,6,7].indexOf(nIndex)) {
            return n - (D*D);
          }
        }
        return n;
      });

      var living = neighbors.map(pos => {
        return cells[pos];
      }).map(neighbor => {
        return neighbor && neighbor.status == 'alive' ? 1 : 0;
      }).reduce((prev, curr) => {
        return prev + curr;
      });

      if (cell.status == 'alive') {
        if (living < 2) {
          cell.fate = DIE; // underpopulation
        }
        else if (living >= 2 && living <= 3) {
          cell.fate = LIVE; // survival
        }
        else if (living > 3) {
          cell.fate = DIE; // overpopulation
        }
      }
      else if (cell.status == 'dead' && living === 3) {
        cell.fate = LIVE; // reproduction
      }
      else {
        cell.fate = cell.status == 'alive' ? LIVE : DIE;
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

  }

  return this;
};

World.prototype.getBinary = function () {
  return this.cells.reduce((prev, curr) => {
    return curr.status == 'alive' ? prev + '1' : prev + '0';
  }, '');
};

World.prototype.stop = function () {
  var world = this;
  world.active = false;
  clearInterval(world.cycleId);

  classes(world.el).remove('active');
  world.startBtn.removeAttribute('disabled');

  console.log('World stopped: ' + world.generation + ' generation(s)');

  return this;
};
