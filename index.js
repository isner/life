
var wrap = document.querySelector('#wrap');

var i = 0;
while (i < 100) {
  var cell = document.createElement('div');
  cell.className = 'cell';
  wrap.appendChild(cell);
  i++;
}
