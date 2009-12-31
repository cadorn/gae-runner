
var WILDFIRE = require("wildfire/binding/jack");
    
exports.app = function(env) {

    WILDFIRE.target("http://pinf.org/cadorn.org/fireconsole").send(
        "Meta Data",
        "Message Data"
    );

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
