/* globals document */
'use strict';

var config = require('../config.json');
var World = require('./world');
var Cell = require('./cell');

var wrap = document.querySelector('#wrap');
var startBtn = document.querySelector('button.start');

var world = new World(wrap);

var i = 0;
while (i < (Math.pow(config.dimensions, 2))) {
  world.register(new Cell(i).appendTo(wrap));
  i++;
}

startBtn.addEventListener('click', function () {
  if (!world.isActive()) {
    world.start();
  }
});
