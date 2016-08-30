/* globals document */
'use strict';

var Emitter = require('component/emitter');
var dataset = require('code42day/dataset');
var classes = require('component/classes');
var events = require('component/events');

module.exports = Cell;

function Cell(n) {
  this.el = document.createElement('div');
  this.n = n;
  classes(this.el).add('cell');
  dataset(this.el, 'n', n);
  this.el.innerHTML = n; // temp
}

Emitter(Cell.prototype);

Cell.prototype.live = function () {
  classes(this.el).add('a');
  this.status = 'alive';
  return this;
};

Cell.prototype.die = function () {
  classes(this.el).remove('a');
  this.status = 'dead';
  return this;
};

Cell.prototype.appendTo = function (target) {
  target.appendChild(this.el);
  return this;
};
