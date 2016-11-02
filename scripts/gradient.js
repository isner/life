
module.exports = gradient;

/**
 * Generates an array colors between a given `startColor` and `endColor`.
 * The array will be a length equal to the given number of `steps`.
 *
 * @param  {String} startColor - ex: '#f0f0f0'
 * @param  {String} endColor
 * @param  {Number} steps
 * @return {Array}
 */

function gradient(startColor, endColor, steps) {
  var start = {
    'Hex': startColor,
    'R'  : parseInt(startColor.slice(1,3), 16),
    'G'  : parseInt(startColor.slice(3,5), 16),
    'B'  : parseInt(startColor.slice(5,7), 16)
  };
  var end = {
   'Hex': endColor,
   'R'  : parseInt(endColor.slice(1,3), 16),
   'G'  : parseInt(endColor.slice(3,5), 16),
   'B'  : parseInt(endColor.slice(5,7), 16)
  };
  diffR = end.R - start.R;
  diffG = end.G - start.G;
  diffB = end.B - start.B;

  stepsHex = [];
  stepsR = [];
  stepsG = [];
  stepsB = [];

  for (var i = 0; i <= steps; i++) {
    stepsR[i] = start.R + ((diffR / steps) * i);
    stepsG[i] = start.G + ((diffG / steps) * i);
    stepsB[i] = start.B + ((diffB / steps) * i);
    stepsHex[i] = '#' + Math.round(stepsR[i]).toString(16) + '' + Math.round(stepsG[i]).toString(16) + '' + Math.round(stepsB[i]).toString(16);
  }

  return stepsHex.map(function (hex) {
    // Extend hex to six characters
    var color = hex.replace('#', '');
    while (color.length < 6) {
      color = '0' + color;
    }
    return '#' + color;
  });
}
