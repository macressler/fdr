"use strict";

var path = require('path');
var BlackBox = require('../index.js');

function zeroPad(num) {
  return(num < 10) ? "0" + num : num;
}

function toJSON() {
  var bb = new BlackBox();
  var dt = new Date();
  var day = dt.getFullYear() + "-" + (zeroPad(dt.getMonth()+1)) + "-" + zeroPad(dt.getDate()) + " " + zeroPad(dt.getHours()) + "-" + dt.getMinutes();
  var out = path.join('navdata', day + ".json");

  bb.toJSON(out);
}

toJSON();
