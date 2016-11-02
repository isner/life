/* globals document */
'use strict';

var Emitter = require('component/emitter');
var dataset = require('code42day/dataset');
var classes = require('component/classes');
var events = require('component/events');
var config = require('../config.json');
var gradient = require('./gradient');

var ALIVE_CLASS = 'a';
var ALIVE = 'alive';
var DEAD = 'dead';
var WHITE = '#fff';

var COLORS = []
  .concat(gradient('#03a9f4', '#ffeb3b', 50))
  .concat(gradient('#ffeb3b', '#f44336', 50));

module.exports = Cell;

function Cell(n) {
  this.el = document.createElement('div');
  this.el.style.backgroundColor = '#fff';
  this.n = n;
  this.status = 'dead';
  this.numLived = 0;
  classes(this.el).add('cell');
  dataset(this.el, 'n', n);
  if (config.showNums) this.el.innerHTML = n;

  this.events = events(this.el, this);
  this.events.bind('click');
}

Emitter(Cell.prototype);

Cell.prototype.live = function () {
  classes(this.el).add(ALIVE_CLASS);
  this.status = ALIVE;
  this.setColor();
  this.numLived++;
  return this;
};

Cell.prototype.die = function () {
  classes(this.el).remove(ALIVE_CLASS);
  this.status = DEAD;
  this.setColor();
  return this;
};

Cell.prototype.toggle = function () {
  if (this.status == ALIVE) {
    this.die();
  }
  else {
    this.live();
  }
};

Cell.prototype.setColor = function () {
  var i = this.numLived;
  if (i > COLORS.length - 1) {
    i = COLORS.length - 1;
  }
  if (this.status == ALIVE) {
    this.el.style.backgroundColor = COLORS[i];
  }
  else {
    this.el.style.backgroundColor = WHITE;
  }
};

Cell.prototype.onclick = function () {
  this.emit('clicked');
};

Cell.prototype.appendTo = function (target) {
  target.appendChild(this.el);
  return this;
};
