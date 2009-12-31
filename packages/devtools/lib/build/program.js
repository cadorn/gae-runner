
function dump(obj) { print(require('test/jsdump').jsDump.parse(obj)) };

var UTIL = require("util");
var FILE = require("file");
var ARGS = require("args");
var OS = require("os");
var STREAM = require('term').stream;
var TUSK = require("narwhal/tusk/tusk");
var PACKAGES = require("packages");
var JSON = require("json");

var Program = exports.Program = function (programPackage) {
    if (!(this instanceof exports.Program))
        return new exports.Program(programPackage);
    this.programPackage = programPackage;
}

Program.prototype.build = function(args) {

    var parser = new ARGS.Parser();
    parser.option('--dev')
        .bool();
    var options = parser.parse(args);


    var sea = TUSK.getActive().getSea();

    var command;
    
    var buildPath = sea.getPath().join("build", this.programPackage.getName());
    if(buildPath.exists()) {
        command = "rm -Rf " + buildPath;
        STREAM.print("\0cyan(" + command + "\0)");
        OS.system(command);
    }
    buildPath.mkdirs();
    
    var jackServletPath = sea.getPackage(module.using["jack-servlet"]).getPath();
    command = "cp -Rf " + jackServletPath.join("*") + " " + buildPath;
    STREAM.print("\0cyan(" + command + "\0)");
    OS.system(command);

    buildPath.join("war", "WEB-INF", "narwhal").remove();
    buildPath.join("war", "WEB-INF", "jackconfig.js").remove();
    buildPath.join("war", "WEB-INF", "lib", "js.jar").remove();
    
    var narwhalPath = PACKAGES.catalog.narwhal.directory;
//    command = "git clone git://github.com/cadorn/narwhal.git " + buildPath.join("war", "WEB-INF", "narwhal");
    command = "cp -Rf " + narwhalPath + " " + buildPath.join("war", "WEB-INF", "narwhal");
    STREAM.print("\0cyan(" + command + "\0)");
    OS.system(command);

    command = "ln -sf ../narwhal/engines/rhino/jars/js.jar" + " " + buildPath.join("war", "WEB-INF", "lib", "js.jar");
    STREAM.print("\0cyan(" + command + "\0)");
    OS.system(command);
    
    var jackPath = sea.getPackage(module.using["jack"]).getPath();
    command = "ln -sf " + jackPath + " " + buildPath.join("war", "WEB-INF", "narwhal", "packages", "jack");
    STREAM.print("\0cyan(" + command + "\0)");
    OS.system(command);

    var appenginePath = sea.getPackage(module.using["appengine"]).getPath();
    command = "ln -sf " + appenginePath + " " + buildPath.join("war", "WEB-INF", "narwhal", "packages", "appengine");
    STREAM.print("\0cyan(" + command + "\0)");
    OS.system(command);

    buildPath.join("war", "WEB-INF", "app").mkdirs();
    command = "ln -sf " + this.programPackage.getPath().join("lib", "jackconfig.js") + " " + buildPath.join("war", "WEB-INF", "app", "jackconfig.js");
    STREAM.print("\0cyan(" + command + "\0)");
    OS.system(command);

    // link using packages
    var packages = [
        this.programPackage.getId(),
        "github.com/cadorn/wildfire/zipball/master/packages/lib-js-system"
    ];
    var usingPackages = {};
    UTIL.forEach(packages, function(pkgId) {
        if(sea.hasPackage(pkgId)) {
            var usingPkg = sea.getPackage(pkgId);
            usingPackages[pkgId] = usingPkg.getPath().valueOf();
            usingPkg.forEachDependency(function(pkg) {
                usingPackages[pkg.getId()] = pkg.getPath().valueOf();
            }, "package", true);
        }
    });
    UTIL.every(usingPackages, function(item) {
        var pkgId = item[0];
        var file = sea.getPath().join("using", pkgId);
        if(file.exists()) {
            buildPath.join("war", "WEB-INF", "using", pkgId).dirname().mkdirs();
            
            command = "ln -sf " + file + " " + buildPath.join("war", "WEB-INF", "using", pkgId);
            STREAM.print("\0cyan(" + command + "\0)");
            OS.system(command);
        }
    });

    command = "ln -sf " + this.programPackage.getPath() + " " + buildPath.join("war", "WEB-INF", "using", this.programPackage.getName());
    STREAM.print("\0cyan(" + command + "\0)");
    OS.system(command);
    


    buildPath.join("war", "WEB-INF", "web.xml").remove();
    var webXmlPath = FILE.Path(module.path).dirname().join("tpl", "etc", "web.xml");
    var data = webXmlPath.read();
    if(options.dev) {
        data = data.replace(/%%__environment__%%/g, "development");
    } else {
        data = data.replace(/%%__environment__%%/g, "none");
    }
    buildPath.join("war", "WEB-INF", "web.xml").write(data);
  
  
    var appengineWebXmlPath = FILE.Path(module.path).dirname().join("tpl", "etc", "appengine-web.xml");
    data = appengineWebXmlPath.read();
    var descriptor = this.programPackage.getManifest().manifest;
    data = data.replace(/%%appengine.name%%/g, descriptor.appengine.name);
    buildPath.join("war", "WEB-INF", "appengine-web.xml").write(data);

}

Program.prototype.dist = function() {
    
    this.build();
    
    var sea = TUSK.getActive().getSea();
    
    var buildPath = sea.getPath().join("build", this.programPackage.getName());
    var descriptor = this.programPackage.getManifest().manifest;
    var appengineSdkPath = sea.getPackage(module.using["appengine-sdk"]).getPath();

    var command = [
        "export APPENGINE_JAVA_SDK=" + appengineSdkPath,
        "cd " + buildPath,
        "ant compile"
    ].join("; ");
    
    STREAM.print("\0cyan(" + command + "\0)");
    OS.system(command);

    command = "sh " + appengineSdkPath.join("bin", "appcfg.sh") +" --email=" + descriptor.appengine.email + " update " + buildPath.join("war");
    STREAM.print("\0cyan(" + command + "\0)");
    OS.system(command);

    print("Access app at: http://" + descriptor.appengine.name + ".appspot.com/");
}

