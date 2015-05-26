/**
 * Blackbox is a flight recorder for AR-Drone parrot which captures the navdata
 * and saves it either to disk or a database.
 */

"use strict";

var fs = require('fs');
var mongo = require("mongodb").MongoClient;

/**Basic function constructor.*/
function BlackBox() { }

/**data to store.*/
BlackBox.prototype.data = [];

/** List of events/hooks. */
BlackBox.prototype.hooks = [];

/**Function intended to be passed as a callback when navdata is emitted.
 * If the user has attached any hooks they will be executed after the data is
 * added to the array.
 * @param {object} data The data to store.
 */
BlackBox.prototype.recordData = function(data) {
  BlackBox.prototype.data.push(data);

  BlackBox.prototype.hooks.forEach(function(hook) {
    hook.cb(data[hook.node]);
  });
};

/**Output the contents of BlackBox data to the standard out.
 */
BlackBox.prototype.toSTDOUT = function() {
  return BlackBox.prototype.data;
};

/**Outputs flight data to a JSON file on disk.
 * @param {string} path Path to store json.
 */
BlackBox.prototype.toJSON = function(path, cb) {
  fs.writeFile(path, JSON.stringify(BlackBox.prototype.data, null, 2), function(err) {
    if(err) throw err;
    else {
      if(cb !== undefined) {
        cb(BlackBox.prototype.data, path);
      }
    }
  });
};

/**Function to add contents of BlackBox data to a MongoDB.
 * @param {object} conArgs The arguments to pass in to establish a database connection.
 * @param {string} collection The collection to add flight data to.
 * @param {function} cb The callback to run when the database write is complete.
 */
BlackBox.prototype.toMongoDB = function(conArgs, cb) {
  var url = "mongodb://" + conArgs.ip + ":" + conArgs.port + "/" + conArgs.db;

  mongo.connect(url, function(err, db) {
    var collection;

    console.log("Connected correctly to server: " + url);

    collection = db.collection(conArgs.collection);

    collection.insert(BlackBox.prototype.data, function(err, result) {
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
BlackBox.prototype.addHook = function(node, cb) {
  BlackBox.prototype.hooks.push({'node': node, 'cb': cb});
  return("Does nothing yet.");
};

module.exports = BlackBox;
