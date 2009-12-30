
var FILE = require("file");

exports.app = function(env)
{    
    return require("jack/reloader").Reloader(new FILE.Path(module.path).dirname().join("server").valueOf(), "app")(env);
}
