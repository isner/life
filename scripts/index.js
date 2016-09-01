/* globals document */
'use strict';

var config = require('../config.json');
var World = require('./world');
var Cell = require('./cell');

var wrap = document.querySelector('#wrap');

var world = new World(wrap);

var i = 0;
while (i < (config.dimensions * 10)) {
  world.register(new Cell(i).appendTo(wrap));
  i++;
}

world.start();
