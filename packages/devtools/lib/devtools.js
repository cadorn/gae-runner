
function dump(obj) { print(require('test/jsdump').jsDump.parse(obj)) };

var ARGS = require("args");
var parser = exports.parser = new ARGS.Parser();

var OS = require("os");
var UTIL = require("util");
var FILE = require("file");
var TUSK = require("narwhal/tusk/tusk");
var STREAM = require('term').stream;
var PACKAGES = require("packages");

parser.help('google app engine developer tools');

parser.helpful();



var tusk = TUSK.Tusk().activate(),
    sea = TUSK.getActive().getSea(),
    command;

command = parser.command('launch', function(options) {
    
    var packageName = options["package"];

    var pkg = sea.getPackage(packageName);
    if(!pkg) {
        print("error: package not found in sea");
        return;
    }
    
    var buildDir = sea.getPath().join("build", packageName);
    if(!buildDir.exists() || options.build) {

        OS.system("tusk package --package " + packageName + " build");
    }


    // load build dependencies
    PACKAGES.load([
        system.prefix,
        sea.getPath()
    ], {
        includeBuildDependencies: true
    });    


    var appengineSdkPath = sea.getPackage(PACKAGES.usingCatalog["github.com/cadorn/gae-runner/raw/master/devtools"].packages["appengine-sdk"]).getPath();
    var command = [
        "export APPENGINE_JAVA_SDK=" + appengineSdkPath,
        "cd " + buildDir,
        "ant runserver"
    ].join("; ");
    
    STREAM.print("\0cyan(" + command + "\0)");
    OS.system(command);
    
});
command.help('Launch a package');
command.option('--package').set().help("The package to launch");
command.option('--build').bool().help("Force a build/rebuild");
command.helpful();


exports.main = function (args) {
    var options = parser.parse(args);
    if (!options.acted) {
        parser.printHelp(options);
    }
}


exports.command = function (command) {
    var process = os.popen(command);
    var result = process.communicate();
    if (result.status !== 0)
        throw new Error(result.stderr.read());
    var stdout = result.stdout.read() || result.stderr.read();
    return stdout;
};

