
exports.app = function(env) {

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
