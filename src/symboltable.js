var KIND;
(function (KIND) {
    KIND["STATIC"] = "static";
    KIND["FIELD"] = "field";
    KIND["ARG"] = "argument";
    KIND["VAR"] = "local";
    KIND["NONE"] = "none";
})(KIND || (KIND = {}));
var SymbolTable = /** @class */ (function () {
    function SymbolTable() {
        this.varCount = {
            ARG: 0,
            FIELD: 0,
            NONE: 0,
            STATIC: 0,
            VAR: 0
        };
        this.startSubroutineScope = [];
    }
    SymbolTable.prototype.define = function (name, type, kind) {
        if (KIND.ARG) {
            var obj = {
                name: name,
                type: type,
                kind: kind,
                index: this.varCount.ARG
            };
            this.startSubroutineScope.push(obj);
            this.varCount.ARG += 1;
        }
        else if (KIND.VAR) {
            var obj = {
                name: name,
                type: type,
                kind: kind,
                index: this.varCount.VAR
            };
            this.varCount.VAR += 1;
            this.startSubroutineScope.push(obj);
        }
        else if (KIND.STATIC) {
            var obj = {
                name: name,
                type: type,
                kind: kind,
                index: this.varCount.STATIC
            };
            this.varCount.STATIC += 1;
            this.startSubroutineScope.push(obj);
        }
        else if (KIND.FIELD) {
            var obj = {
                name: name,
                type: type,
                kind: kind,
                index: this.varCount.FIELD
            };
            this.varCount.FIELD += 1;
            this.startSubroutineScope.push(obj);
        }
    };
    SymbolTable.prototype.kindOf = function (name) {
        var identifier = this.startSubroutineScope.find(function (element) {
            return element['name'] == name;
        });
        if (identifier) {
            return identifier['kind'];
        }
        return KIND.NONE;
    };
    SymbolTable.prototype.typedOf = function (name) {
        var identifier = this.startSubroutineScope.find(function (element) {
            return element['name'] == name;
        });
        if (identifier) {
            return identifier['type'];
        }
        return KIND.NONE;
    };
    SymbolTable.prototype.indexOf = function (name) {
        var index = this.startSubroutineScope.findIndex(function (element) {
            return element['name'] == name;
        });
        return index;
    };
    return SymbolTable;
}());
