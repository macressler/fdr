"use strict";

var fs = require('fs');
var path = require('path');
var FDR = require('../index.js');
var dataPath = path.join('..', 'navdata', '2015-05-24 20-06.json');

var conArgs = {
  "ip": "127.0.0.1",
  "port": "27017",
  "db": "FDR",
  "collection": "flight1"
};

fs.exists(dataPath, function(exists) {
  if(exists) {
    fs.readFile(dataPath, "UTF-8", function(err, data) {
      var bb = new FDR();
      var d;
      if(err) throw err;
      else {
        d = JSON.parse(data);
        d.forEach(function(element) {
          bb.recordData(element);
        });

        bb.toMongoDB(conArgs, function(result) {
          console.log(result);
        });
      }
    });
  }

  else {
    console.log(dataPath, " doesn't exist.");
  }
});
