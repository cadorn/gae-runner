
var WILDFIRE = require("wildfire/binding/jack");
var DISPATCHER = require("dispatcher", "fireconsole");
    
exports.app = function(env) {

    // send a raw wildfire message
    // check the response headers in the Firebug Net panel
    WILDFIRE.target("__TEST__TARGET__").send(
        "Meta Data",
        "Message Data"
    );

    // send a wildfire message via the fireconsole lib
    // this message will show in the Firebug Console if http://www.fireconsole.org/ is installed
    var dispatcher = DISPATCHER.Dispatcher();
    dispatcher.send("Hello World");

    var body = "Hello World";

    return {
        status: 200,
        headers: {
            "Content-Type": "text/html",
            "Content-Length": String(body.length)
        },
        body:[
            body
        ]
    };
};
