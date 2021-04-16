"use strict";
exports.__esModule = true;
exports.VMwriter = void 0;
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
var VMwriter = /** @class */ (function () {
    function VMwriter() {
        this.OutputCommand = '';
    }
    VMwriter.prototype.writePush = function (segment, index) {
        //escrever função
        this.OutputCommand = "push " + segment + " " + index;
    };
    VMwriter.prototype.writePop = function (segment, index) {
        //escrever função
        this.OutputCommand = "pop " + segment + " " + index;
    };
    VMwriter.prototype.writeArithmetic = function (command) {
        this.OutputCommand = "" + command;
    };
    VMwriter.prototype.writeLabel = function (label) {
        this.OutputCommand = "label " + label;
    };
    VMwriter.prototype.writeGOTO = function (label) {
        this.OutputCommand = "goto " + label;
    };
    VMwriter.prototype.writeIf = function (label) {
        this.OutputCommand = "if-goto " + label;
    };
    VMwriter.prototype.writeCall = function (name, nArgs) {
        this.OutputCommand = "call " + name + " " + nArgs;
    };
    VMwriter.prototype.writeFunction = function (name, nLocals) {
        this.OutputCommand = "function " + name + " " + nLocals;
    };
    VMwriter.prototype.writeReturn = function () {
        this.OutputCommand = 'return';
    };
    VMwriter.prototype.writeOutputFile = function (OutputCommand) {
        this.OutputCommand += OutputCommand;
    };
    VMwriter.prototype.writeVM = function () {
        fs.writeFile('Outputcode.vm', this.OutputCommand, function (err) {
            console.log(err);
        });
    };
    return VMwriter;
}());
exports.VMwriter = VMwriter;
