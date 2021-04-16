"use strict";
exports.__esModule = true;
var fs = require("fs");
var Command;
(function (Command) {
    Command["ADD"] = "add";
    Command["SUB"] = "sub";
    Command["NEG"] = "neg";
    Command["EQ"] = "eq";
    Command["GT"] = "gt";
    Command["LT"] = "lt";
    Command["AND"] = "and";
    Command["OR"] = "or";
    Command["NOT"] = "not";
})(Command || (Command = {}));
var Segment;
(function (Segment) {
    Segment["CONST"] = "constant";
    Segment["ARG"] = "argument";
    Segment["LOCAL"] = "local";
    Segment["STATIC"] = "static";
    Segment["THIS"] = "this";
    Segment["THAT"] = "that";
    Segment["POINTER"] = "pointer";
    Segment["TEMP"] = "temp";
})(Segment || (Segment = {}));
var vmwriter = /** @class */ (function () {
    function vmwriter() {
        this.OutputCommand = '';
    }
    vmwriter.prototype.writePush = function (segment, index) {
        //escrever função
        this.OutputCommand = 'push ${segment} ${index}';
    };
    vmwriter.prototype.writePop = function (segment, index) {
        //escrever função
        this.OutputCommand = 'pop ${segment} ${index}';
    };
    vmwriter.prototype.writeArithmetic = function (command) {
        this.OutputCommand = '${command}';
    };
    vmwriter.prototype.writeLabel = function (label) {
        this.OutputCommand = "label ${label}";
    };
    vmwriter.prototype.writeGOTO = function (label) {
        this.OutputCommand = 'goto ${label}';
    };
    vmwriter.prototype.writeIf = function (label) {
        this.OutputCommand = 'if-goto ${label}';
    };
    vmwriter.prototype.writeCall = function (name, nArgs) {
        this.OutputCommand = 'call ${name} ${nArgs}';
    };
    vmwriter.prototype.writeFunction = function (name, nLocals) {
        this.OutputCommand = 'function ${name} ${nLocals}';
    };
    vmwriter.prototype.writeReturn = function () {
        this.OutputCommand = 'return';
    };
    vmwriter.prototype.writeOutputFile = function (OutputCommand) {
        this.OutputCommand += OutputCommand;
    };
    vmwriter.prototype.writeVM = function () {
        fs.writeFile('Outputcode.vm', this.OutputCommand, function (err) {
            console.log(err);
        });
    };
    return vmwriter;
}());
