
function dump(obj) { print(require('test/jsdump').jsDump.parse(obj)) };

var FILE = require("file");
var OS = require("os");
var STREAM = require('term').stream;
var TUSK = require("narwhal/tusk/tusk");
var PACKAGES = require("packages");

var Program = exports.Program = function (programPackage) {
    if (!(this instanceof exports.Program))
        return new exports.Program(programPackage);
    this.programPackage = programPackage;
}

Program.prototype.build = function() {
    
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

    command = "ln -sf " + this.programPackage.getPath().join("lib") + " " + buildPath.join("war", "WEB-INF", "app");
    STREAM.print("\0cyan(" + command + "\0)");
    OS.system(command);


    buildPath.join("war", "WEB-INF", "web.xml").remove();
    var webXmlPath = FILE.Path(module.path).dirname().join("tpl", "etc", "web.xml");
    webXmlPath.copy(buildPath.join("war", "WEB-INF", "web.xml"));
  
  
    var appengineWebXmlPath = FILE.Path(module.path).dirname().join("tpl", "etc", "appengine-web.xml");
    var data = appengineWebXmlPath.read();
    var descriptor = this.programPackage.getManifest().manifest;
    data = data.replace(/%%appengine.name%%/g, descriptor.appengine.name);
    buildPath.join("war", "WEB-INF", "appengine-web.xml").write(data);

}

Program.prototype.dist = function() {
    
//    this.build();
    
    var sea = TUSK.getActive().getSea();
    
    var buildPath = sea.getPath().join("build", this.programPackage.getName());
    var descriptor = this.programPackage.getManifest().manifest;
    var appengineSdkPath = sea.getPackage(module.using["appengine-sdk"]).getPath();

    var command = "sh " + appengineSdkPath.join("bin", "appcfg.sh") +" --email=" + descriptor.appengine.email + " update " + buildPath.join("war");
    STREAM.print("\0cyan(" + command + "\0)");
    OS.system(command);

    print("Access app at: http://" + descriptor.appengine.name + ".appspot.com/");
}

