"use strict";
exports.__esModule = true;
exports.AnalisadorSintatico = void 0;
var fs = require("fs");
var app_1 = require("./app");
var keyword = "[\
    class | constructor | function |method | field | static | var |int | char | boolean | void |true |false | null | this | let | do |if | else | while | return \
]";
var expressions = "[{ | } | ( | ) | [ | ] | . |, | ; | + | - |  | /* | & || | < | > | = | ~ \
]";
var AnalisadorSintatico = /** @class */ (function () {
    function AnalisadorSintatico(jackFile) {
        this.tokenizer = new app_1.Tokenizer('Main.jack');
        this.XMLFile = "";
        this.xmlContent = "";
        try {
            var data = fs.readFileSync(jackFile, 'utf8');
            console.log(data);
            this.jackFile = data.split("\n");
            this.XMLFile = fs.readFile('compile.xml', 'utf8', function (err, data) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                console.log('xml file ', data);
            });
            this.compileClass();
        }
        catch (e) {
            console.log('Error:', e.stack);
        }
    }
    AnalisadorSintatico.prototype.compileClass = function () {
        console.log('entered compileClass');
        this.writeXML("<class>");
        this.tokenizer.advance();
        //aqui  precisa adicionar o arquivo
        if (this.tokenizer.keyWord() != 'class') {
            //wait for a class here
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        if (!this.tokenizer.identifier()) {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        if (this.tokenizer.symbol() != "{") {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        //verifica se a alguma declaração de variáveis
        while (this.tokenizer.keyWord().indexOf("static") != -1 ||
            this.tokenizer.keyWord().indexOf("field") != -1) {
            this.compileClassVarDec();
        }
        while (["constructor", "function", "method"].includes(this.tokenizer.keyWord())) {
            this.compileSubtoutine();
        }
        //AJUSTAR AQUI    
        if (this.tokenizer.symbol() != "}") {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.writeXML("</class>");
    };
    AnalisadorSintatico.prototype.compileClassVarDec = function () {
        console.log('entered compileVardDec');
        this.writeXML("<classVarDec>");
        //compiles a declaration when it is a field or static 
        if (!["static", "field"].includes(this.tokenizer.keyWord())) {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        if (!this.tokenizer.identifier() && !["int", "char", "boolean"].includes(this.tokenizer.keyWord())) {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        if (!this.tokenizer.identifier()) {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        //check for and varname
        while (this.tokenizer.symbol() == ",") {
            this.tokenizer.advance();
            //wait for identifier
            if (!this.tokenizer.identifier()) {
                return false;
            }
            this.writeXML(this.tokenizer.printToken());
            this.tokenizer.advance();
        }
        if (this.tokenizer.symbol() != ";") {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        this.writeXML("</classVarDec>");
    };
    AnalisadorSintatico.prototype.compileSubtoutine = function () {
        console.log('entered compileSuboutine');
        this.writeXML("<subroutineDec>");
        //compile constructor, function or method
        if (!["constructor", "function", "method"].includes(this.tokenizer.keyWord())) {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        if (!this.tokenizer.identifier() &&
            !["void", "int", "char", "boolean"].includes(this.tokenizer.keyWord())) {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        //wait for a function name
        if (!this.tokenizer.identifier()) {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        //check parameter list
        //this.compileList();
        //await )
        if (this.tokenizer.symbol() != "(") {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        //wait for parameter list
        this.writeXML("<parameterList>");
        this.compileExpressionList(); //CHECAR AQUI
        this.writeXML("</parameterList>");
        if (this.tokenizer.symbol() != ")") {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.writeXML("<subroutineBody>");
        this.tokenizer.advance();
        if (this.tokenizer.symbol() != "{") {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        //wait for var declaration
        this.tokenizer.advance();
        while (this.tokenizer.keyWord() == "var") {
            this.compileVarDec();
        }
        //wait statments 
        while (["let", "if", "while", "do", "return"].includes(this.tokenizer.keyWord())) {
            this.compileStatments();
        }
        //wait for } to end subroutine
        if (this.tokenizer.symbol() != "}") {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        this.writeXML("</subroutineBody");
        this.writeXML("</subroutineDec>");
    };
    AnalisadorSintatico.prototype.compileParameterList = function () {
        console.log('entered compileParameterList');
        if (!["void", "int", "char", "boolean"].includes(this.tokenizer.keyWord()) && !this.tokenizer.identifier()) {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        //wait for var name
        if (!this.tokenizer.identifier()) {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        while (this.tokenizer.symbol() == ",") {
            this.tokenizer.advance();
            if (!["int", "char", "boolean"].includes(this.tokenizer.keyWord()) && !this.tokenizer.identifier()) {
                return false;
            }
            this.writeXML(this.tokenizer.printToken());
            this.tokenizer.advance();
            //wait for var name
            if (!this.tokenizer.identifier()) {
                return false;
            }
            this.writeXML(this.tokenizer.printToken());
            this.tokenizer.advance();
        }
    };
    AnalisadorSintatico.prototype.compileVarDec = function () {
        console.log('entered compileVarDec');
        this.writeXML("<varDec>");
        //wait for a var declaration
        if (this.tokenizer.keyWord() != "var") {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        //expected a var type
        if (!["int", "char", "boolean"].includes(this.tokenizer.keyWord()) && !this.tokenizer.identifier()) {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        if (this.tokenizer.tokenType() != this.tokenizer.tokenType() &&
            this.tokenizer.tokenType() == "identifier") { //JackTokenizer.Identifier
            return false;
        }
        this.tokenizer.advance();
        while (this.tokenizer.symbol() == ",") {
            this.writeXML(this.tokenizer.printToken());
            this.tokenizer.advance();
            if (!this.tokenizer.identifier()) {
                return false;
            }
            this.writeXML(this.tokenizer.printToken());
            this.tokenizer.advance();
        }
        if (this.tokenizer.symbol() != ";") {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        this.writeXML("</varDec>");
    };
    AnalisadorSintatico.prototype.compileStatments = function () {
        console.log('entered compileStatement');
        'wait for a sequence of statements, not includind {}';
        this.writeXML("<statements>");
        while (["let", "if", "while", "do", "return"].includes(this.tokenizer.keyWord())) {
            switch (this.tokenizer.keyWord()) {
                case "left":
                    this.compileLet();
                    break;
                case "if":
                    this.compileIf();
                    break;
                case "while":
                    this.compileWhile();
                    break;
                case "do":
                    this.compileDo();
                    break;
                case "return":
                    this.compileReturn();
                    break;
            }
        }
        this.writeXML("</statements>");
    };
    AnalisadorSintatico.prototype.compileDo = function () {
        console.log('entered compileDo');
        this.writeXML("<doStatement>");
        if (this.tokenizer.keyWord() != "do") {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        //wait subroutine
        this.compileSubtoutine();
        //wait for ;
        if (this.tokenizer.symbol() != ";") {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        this.writeXML("</doStatement>");
    };
    AnalisadorSintatico.prototype.compileLet = function () {
        console.log('entered compileLet');
        //wait for a let statement
        this.writeXML("<letStatement>");
        if (this.tokenizer.keyWord() != "let") {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        if (!this.tokenizer.identifier()) {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        if (this.tokenizer.symbol() == "[") {
            this.writeXML(this.tokenizer.printToken());
            this.tokenizer.advance();
            this.compileExpression();
            if (this.tokenizer.symbol() != "]") {
                return false;
            }
            this.writeXML(this.tokenizer.printToken());
            this.tokenizer.advance();
        }
        //wait for =
        if (this.tokenizer.symbol() != "=") {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        this.compileExpression();
        if (this.tokenizer.symbol() != ";") {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        this.writeXML("</letStatement>");
    };
    AnalisadorSintatico.prototype.compileWhile = function () {
        console.log('entered compileWhile');
        this.writeXML("whileStatement>");
        //compile wait statement
        if (this.tokenizer.keyWord() != 'while') {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        //wait for a (
        if (this.tokenizer.symbol() != "(") {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        this.compileExpression();
        //wait for a )
        if (this.tokenizer.symbol() != ")") {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        //wait for a {
        if (this.tokenizer.symbol() != "{") {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        this.compileStatments();
        //wait for a }
        if (this.tokenizer.symbol() != "}") {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        this.writeXML("</whileStatement>");
    };
    AnalisadorSintatico.prototype.compileReturn = function () {
        console.log('entered compileReturn');
        this.writeXML("<returnStatement>");
        if (this.tokenizer.keyWord() != "return") {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        if (this.tokenizer.symbol() != ";") {
            //wait for a expression
            this.compileExpression();
        }
        if (this.tokenizer.symbol() != ";") {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        this.writeXML("</returnStatement");
    };
    AnalisadorSintatico.prototype.compileIf = function () {
        console.log('entered compileIf');
        this.writeXML("<ifStatement>");
        if (this.tokenizer.keyWord() != "if") {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        //wait for a (
        if (this.tokenizer.symbol() != "(") {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        this.compileExpression();
        //wait for )
        if (this.tokenizer.symbol() != ")") {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        //expect {
        if (this.tokenizer.symbol() != "{") {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        this.compileStatments();
        //wait for a }
        if (this.tokenizer.symbol() != "}") {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        if (this.tokenizer.keyWord() == "else") {
            this.tokenizer.advance();
            this.compileStatments();
            if (this.tokenizer.symbol() != "}") {
                return false;
            }
            this.writeXML(this.tokenizer.printToken());
            this.tokenizer.advance();
        }
        this.writeXML("</ifStatement>");
    };
    AnalisadorSintatico.prototype.compileExpression = function () {
        console.log('entered compileExpression');
        this.writeXML("<expression>");
        this.compileTerm();
        while (["+", "-", "*", "/", "&", "|", "<", ">", "="].includes(this.tokenizer.symbol())) {
            this.writeXML(this.tokenizer.printToken());
            this.tokenizer.advance();
            this.compileTerm();
        }
        this.writeXML("</expression>");
    };
    AnalisadorSintatico.prototype.compileTerm = function () {
        console.log('entered compileTerm');
        this.writeXML("<term>");
        var thisisterm = false;
        if (this.tokenizer.intVal()) {
            thisisterm = true;
            this.writeXML(this.tokenizer.printToken());
        }
        else if (this.tokenizer.stringVal()) {
            thisisterm = true;
            this.writeXML(this.tokenizer.printToken());
        }
        else if (this.tokenizer.keyWord()) {
            var keyterm = this.tokenizer.keyWord();
            if (!["true", "false", "null", "this"].includes(keyterm)) {
                return false;
            }
            thisisterm = true;
            this.writeXML(this.tokenizer.printToken());
        }
        else if (this.tokenizer.symbol() == "(") {
            this.writeXML(this.tokenizer.printToken());
            this.tokenizer.advance();
            this.compileExpression();
            if (this.tokenizer.symbol() != ")") {
                return false;
            }
            thisisterm = true;
            this.writeXML(this.tokenizer.printToken());
        }
        else if (["-", "~"].includes(this.tokenizer.symbol())) {
            this.writeXML(this.tokenizer.printToken());
            this.tokenizer.advance();
            this.compileTerm();
        }
        else if (this.tokenizer.identifier()) {
            this.writeXML(this.tokenizer.printToken());
            this.tokenizer.advance();
            if (this.tokenizer.symbol() == "[") {
                this.writeXML(this.tokenizer.printToken());
                this.tokenizer.advance();
                this.compileExpression();
                if (this.tokenizer.symbol() != "]") {
                    return false;
                }
                thisisterm = true;
                this.writeXML(this.tokenizer.printToken());
            }
            else if (this.tokenizer.symbol() == "(") {
                this.tokenizer.advance();
                this.compileExpressionList();
                this.tokenizer.advance();
                //wait for )
                if (this.tokenizer.symbol() != ")") {
                    return false;
                }
                thisisterm = true;
                this.writeXML(this.tokenizer.printToken());
            }
            else if (this.tokenizer.symbol() == ".") {
                this.writeXML(this.tokenizer.printToken());
                this.tokenizer.advance();
                if (!this.tokenizer.identifier()) {
                    return false;
                }
                this.writeXML(this.tokenizer.printToken());
                this.tokenizer.advance();
                if (this.tokenizer.symbol() != "(") {
                    return false;
                }
                this.writeXML(this.tokenizer.printToken());
                this.tokenizer.advance();
                this.compileExpressionList();
                if (this.tokenizer.symbol() != ")") {
                    return false;
                }
                thisisterm = true;
                this.writeXML(this.tokenizer.printToken());
            }
        }
        if (thisisterm = true) {
            this.tokenizer.advance();
        }
        this.writeXML("</term>");
    };
    AnalisadorSintatico.prototype.compileExpressionList = function () {
        console.log('entered compileExpressionList');
        this.writeXML("<expressionList>");
        this.compileExpression();
        while (this.tokenizer.symbol() == ",") {
            this.writeXML(this.tokenizer.printToken());
            this.tokenizer.advance();
            this.compileExpression();
        }
        this.writeXML("</expressionList>");
    };
    AnalisadorSintatico.prototype.compileSubroutineCall = function () {
        console.log('entered compileSubroutineCall');
        if (!this.tokenizer.identifier()) {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        if (this.tokenizer.symbol() == "(") {
            this.writeXML(this.tokenizer.printToken());
            this.tokenizer.advance();
            this.compileExpressionList();
            //wait for )
            if (this.tokenizer.symbol() != ")") {
                return false;
            }
            this.writeXML(this.tokenizer.printToken());
        }
        else if (this.tokenizer.symbol() == ".") {
            this.writeXML(this.tokenizer.printToken());
            this.tokenizer.advance();
            //wait a identifier for method name
            if (!this.tokenizer.identifier()) {
                return false;
            }
            this.writeXML(this.tokenizer.printToken());
            this.tokenizer.advance();
            //wait for a (
            if (this.tokenizer.symbol() != "(") {
                return false;
            }
            this.writeXML(this.tokenizer.printToken());
            this.tokenizer.advance();
            this.compileExpressionList();
            if (this.tokenizer.symbol() != ")") {
                return false;
            }
            this.writeXML(this.tokenizer.printToken());
        }
        else {
            return false;
        }
        this.tokenizer.advance();
    };
    /*setXMLContent(expression:string)
    {
        this.XMLFile += expression;
    }*/
    AnalisadorSintatico.prototype.writeXML = function (xmlContent) {
        fs.writeFile('compile.xml', xmlContent, function (err) {
            console.log(err);
        });
    };
    return AnalisadorSintatico;
}());
exports.AnalisadorSintatico = AnalisadorSintatico;
