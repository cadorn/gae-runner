
exports.app = function(env)
{
    return require("server", "test-app").app(env);
}

exports.development = function(app)
{
    return function(env) {
        return require("jack/reloader").Reloader(module.id, "app")(env);
    };
}
