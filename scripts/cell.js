/* globals document */
'use strict';

var Emitter = require('component/emitter');
var dataset = require('code42day/dataset');
var classes = require('component/classes');
var events = require('component/events');
var config = require('../config.json');

module.exports = Cell;

function Cell(n) {
  this.el = document.createElement('div');
  this.n = n;
  this.status = 'dead';
  classes(this.el).add('cell');
  dataset(this.el, 'n', n);
  if (config.showNums) this.el.innerHTML = n;

  this.events = events(this.el, this);
  this.events.bind('click');
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

Cell.prototype.toggle = function () {
  if (this.status == 'alive') {
    this.die();
  }
  else {
    this.live();
  }
};

Cell.prototype.onclick = function () {
  this.emit('clicked');
};

Cell.prototype.appendTo = function (target) {
  target.appendChild(this.el);
  return this;
};
