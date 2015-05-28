/**
 * FDR is a flight recorder for AR-Drone parrot which captures the navdata
 * and saves it either to disk or a database.
 */

"use strict";

var fs = require('fs');
var mongo = require("mongodb").MongoClient;

/**Basic function constructor.*/
function FDR() { }

/**data to store.*/
FDR.prototype.data = [];

/** List of events/hooks. */
FDR.prototype.hooks = [];

/**Function intended to be passed as a callback when navdata is emitted.
 * If the user has attached any hooks they will be executed after the data is
 * added to the array.
 * @param {object} data The data to store.
 */
FDR.prototype.recordData = function(data) {
  FDR.prototype.data.push(data);

  FDR.prototype.hooks.forEach(function(hook) {
    hook.cb(data[hook.node]);
  });
};

/**Output the contents of FDR data to the standard out.
 */
FDR.prototype.toSTDOUT = function() {
  return FDR.prototype.data;
};

/**Outputs flight data to a JSON file on disk.
 * @param {string} path Path to store json.
 */
FDR.prototype.toJSON = function(path, cb) {
  fs.writeFile(path, JSON.stringify(FDR.prototype.data, null, 2), function(err) {
    if(err) throw err;
    else {
      if(cb !== undefined) {
        cb(FDR.prototype.data, path);
      }
    }
  });
};

/**Function to add contents of FDR data to a MongoDB.
 * @param {object} conArgs The arguments to pass in to establish a database connection.
 * @param {string} collection The collection to add flight data to.
 * @param {function} cb The callback to run when the database write is complete.
 */
FDR.prototype.toMongoDB = function(conArgs, cb) {
  var url = "mongodb://" + conArgs.ip + ":" + conArgs.port + "/" + conArgs.db;

  mongo.connect(url, function(err, db) {
    var collection;

    console.log("Connected correctly to server: " + url);

    collection = db.collection(conArgs.collection);

    collection.insert(FDR.prototype.data, function(err, result) {
      if(err) throw err;

      db.close();
      if(cb !== undefined) {
        cb(result);
      }
    });
  });
};

/**Function to add hooks into the flight recorder data events.
* @param {string} node The state node to hook into.
* @param {function} cb The callback function to execute.
*/
FDR.prototype.addHook = function(node, cb) {
  FDR.prototype.hooks.push({'node': node, 'cb': cb});
  return("Does nothing yet.");
};

module.exports = FDR;
