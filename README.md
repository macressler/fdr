Welcome to FDR!
===================


# FDR

An AR Drone Parrot 2.0 flight data recorder, it was designed to work along side the [ARDrone](https://www.npmjs.com/package/ar-drone) npm module.

----------
#API

FDR has a very simple and consistent API, it isn't finished yet however and work is ongoing so please do check regularly the code itself in case the documents have gotten out of sync.

FDR is designed to capture navigational data generated by an AR Drone Parrot 2.0 and dump it out to some form of backend, currently STDOUT, a JSON text file and MongoDB are supported.

```js
toSTDOUT()
toJSON(fileName, callBack(data, path) {/**/});
toMongoDB(connectionArguments, callBack(result) {/**/});
```

----------

# Examples

The following should be enough to get anyone up and running with the basics of FDR.

```js
var ardrone = require("ar-drone");
var FDR = require("fdr");
var client = ardrone.createClient();
var bb = new FDR();

client.on("navdata", bb.recordData);
  client.land(function() {
    var out = path.join("navdata", "data.json");
    bb.toJSON(out);
  });
});

```

This example shows how to write information to a MongoDB backend.

```js
var ardrone = require("ar-drone");
var FDR = require("FDR");
var client = ardrone.createClient();
var bb = new FDR();

var conArgs = {
  "ip": "127.0.0.1",
  "port": "27017",
  "db": "FDR",
  "collection": "flight1"
};

client.on("navdata", bb.recordData);
  client.land(function() {
    var out = path.join("navdata", "data.json");
    bb.toMongoDB(conArgs, function(result) {
      console.log(result);
    });
  });
});

```
