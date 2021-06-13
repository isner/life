/* globals document */
'use strict';

var Emitter = require('component-emitter');
var classes = require('component-classes');
var events = require('component-events');
var config = require('../config.json');
var World = require('./world');
var Cell = require('./cell');

module.exports = Game;

function Game(el) {
  this.el = el;
  this.world = new World(document.querySelector('#wrap'));

  var i = 0;
  var worldEl = this.world.el;
  while (i < (Math.pow(config.dimensions, 2))) {
    this.world.register(new Cell(i).appendTo(worldEl));
    i++;
  }
  this.events = events(this.el, this);
  this.events.bind('click button.start', 'start');
  this.events.bind('click button.stop', 'stop');
}

Game.prototype.start = function () {
  if (!this.world.isActive()) {
    this.world.start();
  }
  this.world.stopBtn.focus();
};

Game.prototype.stop = function () {
  if (this.world.isActive()) {
    this.world.stop();
  }
  this.world.startBtn.focus();
};
