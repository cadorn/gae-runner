

function dump(obj) { print(require('test/jsdump').jsDump.parse(obj)) };


var UTIL = require("util");
var WILDFIRE = require("wildfire");
var WILDFIRE_BINDING = require("wildfire/binding/jack");
var DISPATCHER = require("dispatcher", "fireconsole");
var MEMCACHED = require("google/appengine/api/memcache", "appengine");

exports.app = function(env) {
    
    var transport = WILDFIRE.getModule("transport").Transport({
        "getUrl": function(key) {
            return "http://" + env["SERVER_NAME"] + ":" + env["SERVER_PORT"] + "/__WF/" + key;
        },
        "getData": function(key) {
            return MEMCACHED.get(key);
        },
        "setData": function(key, value) {
            return MEMCACHED.set(key, value, 60);   // 60 second expiry is plenty
        }
    });
    WILDFIRE_BINDING.getChannel().setTransport(transport);

    // intercept Wildfire transport URLs
    var match = env["PATH_INFO"].match(/^\/__WF\/(.*)$/);
    if(match) {
        return transport.serviceDataRequest(match[1]);
    }
    

    // send a raw wildfire message
    // check the response headers in the Firebug Net panel
    WILDFIRE_BINDING.target("__TEST__TARGET__").send(
        "Meta Data",
        "Message Data"
    );

    // send a wildfire message via the fireconsole lib
    // this message will show in the Firebug Console if http://www.fireconsole.org/ is installed
    var dispatcher = DISPATCHER.Dispatcher();
    dispatcher.send("System Properties", {
        "fc.group.start": true
    });
    UTIL.every(system.env, function(item) {
        dispatcher.send(item[1], {
            "fc.msg.label": item[0]
        });
    });
    dispatcher.send("", {
        "fc.group.end": true
    });
    dispatcher.send("Request Properties", {
        "fc.group.start": true
    });
    UTIL.every(env, function(item) {
        dispatcher.send(item[1], {
            "fc.msg.label": item[0]
        });
    });
    dispatcher.send("", {
        "fc.group.end": true
    });

    var body = "Hello World";

    return {
        status: 200,
        headers: {
            "Content-Type": "text/html",
            "Content-Length": String(body.length)
        },
        body: [
            body
        ]
    };
};
