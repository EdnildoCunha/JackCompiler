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
        var _this = this;
        this.tokenizer = new app_1.Tokenizer('Main.jack');
        this.XMLFile = "";
        this.xmlContent = "";
        try {
            fs.readFile(jackFile, 'utf8', function (err, data) {
                if (err) {
                    console.log('error in read file');
                    console.log(err);
                    throw err;
                    ;
                }
                console.log('Jack code');
                _this.jackFile = data.split("\n");
                console.log('CONTENT JACK', jackFile);
                _this.compileClass();
                console.log('CONTENT XML ');
                console.log(_this.xmlContent);
                _this.writeXML();
            });
        }
        catch (e) {
            console.log('Error:', e.stack);
        }
    }
    AnalisadorSintatico.prototype.compileClass = function () {
        console.log('entered compileClass');
        this.writeXMLContent("<class>\n");
        this.tokenizer.advance();
        //aqui  precisa adicionar o arquivo
        if (this.tokenizer.keyWord() != 'class') {
            //wait for a class here
            console.log('RETORNOU NO KEYWORD CLASS');
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        console.log('expected identifier ');
        console.log(this.tokenizer.identifier());
        //here wait for a  name class
        if (!this.tokenizer.identifier()) {
            console.log('RETORNOU NO IDENTIFIE CLASS');
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        if (this.tokenizer.symbol() != "{") {
            console.log('RETORNOU NO SYMBLE {');
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        //verifica se a alguma declaração de variáveis
        //console.log(this.tokenizer.keyWord())
        //console.log('FIRST WHILE 1 ', this.tokenizer.keyWord().indexOf("static"));
        //console.log('FIRST WHILE 2 ', this.tokenizer.keyWord().indexOf("field"));
        while (["static", "field"].includes(this.tokenizer.keyWord())
        //this.tokenizer.keyWord().indexOf("static") != -1 ||
        //this.tokenizer.keyWord().indexOf("field") != -1
        ) {
            this.compileClassVarDec();
        }
        //console.log('FIRST WHILE 3 ', ["constructor", "function", "method"].includes(this.tokenizer.keyWord()));
        while (["constructor", "function", "method"].includes(this.tokenizer.keyWord())) {
            this.compileSubroutine();
        }
        //await for close }    
        if (this.tokenizer.symbol() != "}") {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.writeXMLContent("<class>\n");
    };
    AnalisadorSintatico.prototype.compileClassVarDec = function () {
        console.log('entered compileVardDec');
        this.writeXMLContent("<classVarDec>\n");
        //compiles a declaration when it is a field or static 
        console.log('token varDec ', this.tokenizer.keyWord());
        if (!["static", "field"].includes(this.tokenizer.keyWord())) {
            console.log('RETURNED IN VAR DEC');
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        if (!this.tokenizer.identifier() && !["int", "char", "boolean"].includes(this.tokenizer.keyWord())) {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        if (!this.tokenizer.identifier()) {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        //check for varname
        while (this.tokenizer.symbol() == ",") {
            this.tokenizer.advance();
            //wait for identifier
            if (!this.tokenizer.identifier()) {
                return false;
            }
            this.writeXMLContent(this.tokenizer.printToken());
            this.tokenizer.advance();
        }
        if (this.tokenizer.symbol() != ";") {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        this.writeXMLContent("</classVarDec>\n");
    };
    AnalisadorSintatico.prototype.compileSubroutine = function () {
        console.log('entered compileSuboutine');
        this.writeXMLContent("<subroutineDec>\n");
        //compile constructor, function or method
        console.log('SUBROUTINE KEYWORD ', this.tokenizer.keyWord());
        if (!["constructor", "function", "method"].includes(this.tokenizer.keyWord())) {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        if (!this.tokenizer.identifier() && !["void", "int", "char", "boolean"].includes(this.tokenizer.keyWord())) {
            console.log('RETURNED IN FUNCTION EXPECTED');
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        //wait for a function name
        if (!this.tokenizer.identifier()) {
            console.log('RETURNED WAIT FUNCTION NAME');
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        //await )
        if (this.tokenizer.symbol() != "(") {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        //wait for parameter list
        this.writeXMLContent("<parameterList>\n");
        this.compileExpressionList(); //CHECAR AQUI
        this.writeXMLContent("</parameterList>\n");
        if (this.tokenizer.symbol() != ")") {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.writeXMLContent("<subroutineBody>\n");
        this.tokenizer.advance();
        if (this.tokenizer.symbol() != "{") {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        //wait for var declaration
        this.tokenizer.advance();
        console.log('CURRENT  WHILE');
        while (this.tokenizer.keyWord() == "var") {
            this.compileVarDec();
        }
        console.log('NEXT WHILE');
        //wait statments 
        while (["let", "if", "while", "do", "return"].includes(this.tokenizer.keyWord())) {
            this.compileStatments();
        }
        //wait for } to end subroutine
        if (this.tokenizer.symbol() != "}") {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        this.writeXMLContent("</subroutineBody");
        this.writeXMLContent("</subroutineDec>\n");
    };
    AnalisadorSintatico.prototype.compileParameterList = function () {
        if (this.tokenizer.tokenType() != 'identifier') {
            return false;
        }
        console.log('entered compileParameterList');
        if (!["void", "int", "char", "boolean"].includes(this.tokenizer.keyWord()) && !this.tokenizer.identifier()) {
            console.log('PARAMETER LIST RETURNED FIRS IF ');
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        //wait for var name
        if (!this.tokenizer.identifier()) {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        console.log('RETURNED , ', this.tokenizer.symbol() == ",");
        while (this.tokenizer.symbol() == ",") {
            this.writeXMLContent(this.tokenizer.printToken());
            this.tokenizer.advance();
            if (!["int", "char", "boolean"].includes(this.tokenizer.keyWord()) && !this.tokenizer.identifier()) {
                console.log('RETURNED TT ', this.tokenizer.symbol() == ",");
                return false;
            }
            this.writeXMLContent(this.tokenizer.printToken());
            this.tokenizer.advance();
            //wait for var name
            if (!this.tokenizer.identifier()) {
                return false;
            }
            this.writeXMLContent(this.tokenizer.printToken());
            this.tokenizer.advance();
        }
    };
    AnalisadorSintatico.prototype.compileVarDec = function () {
        console.log('entered compileVarDec');
        this.writeXMLContent("<varDec>\n");
        //wait for a var declaration
        if (this.tokenizer.keyWord() != "var") {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        //expected a var type
        if (!["int", "char", "boolean"].includes(this.tokenizer.keyWord()) && !this.tokenizer.identifier()) {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        if (
        //this.tokenizer.tokenType() != this.tokenizer.tokenType() 
        //&& 
        this.tokenizer.tokenType() == "identifier") {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        while (this.tokenizer.symbol() == ",") {
            this.writeXMLContent(this.tokenizer.printToken());
            this.tokenizer.advance();
            if (!this.tokenizer.identifier()) {
                return false;
            }
            this.writeXMLContent(this.tokenizer.printToken());
            this.tokenizer.advance();
        }
        if (this.tokenizer.symbol() != ";") {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        this.writeXMLContent("</varDec>\n");
    };
    AnalisadorSintatico.prototype.compileStatments = function () {
        console.log('entered compileStatement');
        'wait for a sequence of statements, not includind {}';
        this.writeXMLContent("<statements>\n");
        console.log('STATE CONDITION 1 ', ["let", "if", "while", "do", "return"].includes(this.tokenizer.keyWord()));
        console.log('KEYWORD STATE ', this.tokenizer.keyWord());
        while (["let", "if", "while", "do", "return"].includes(this.tokenizer.keyWord())) {
            //CHECAR AQUI;
            var _token = this.tokenizer.keyWord();
            if (_token == "left") {
                this.compileLet();
            }
            if (_token == "if") {
                this.compileIf();
            }
            if (_token == "while") {
                this.compileWhile();
            }
            if (_token == "do") {
                this.compileDo();
            }
            if (_token == "return") {
                this.compileReturn();
            }
            /*switch(this.tokenizer.keyWord())
            {
                case "let":
                    ///console.log('LET')
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
            }*/
        }
        this.writeXMLContent("</statements>\n");
    };
    AnalisadorSintatico.prototype.compileDo = function () {
        console.log('entered compileDo');
        this.writeXMLContent("<doStatement>\n");
        if (this.tokenizer.keyWord() != "do") {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        //wait subroutine
        //CHECAR AQUI
        this.compileSubroutine();
        //wait for ;
        if (this.tokenizer.symbol() != ";") {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        this.writeXMLContent("</doStatement>\n");
    };
    AnalisadorSintatico.prototype.compileLet = function () {
        console.log('entered compileLet');
        //wait for a let statement
        this.writeXMLContent("<letStatement>\n");
        if (this.tokenizer.keyWord() != "let") {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        if (!this.tokenizer.identifier()) {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        if (this.tokenizer.symbol() == "[") {
            this.writeXMLContent(this.tokenizer.printToken());
            this.tokenizer.advance();
            this.compileExpression();
            if (this.tokenizer.symbol() != "]") {
                return false;
            }
            this.writeXMLContent(this.tokenizer.printToken());
            this.tokenizer.advance();
        }
        //wait for =
        if (this.tokenizer.symbol() != "=") {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        this.compileExpression();
        if (this.tokenizer.symbol() != ";") {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        this.writeXMLContent("</letStatement>\n");
    };
    AnalisadorSintatico.prototype.compileWhile = function () {
        console.log('entered compileWhile');
        this.writeXMLContent("whileStatement>\n");
        //compile wait statement
        if (this.tokenizer.keyWord() != 'while') {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        //wait for a (
        if (this.tokenizer.symbol() != "(") {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        this.compileExpression();
        //wait for a )
        if (this.tokenizer.symbol() != ")") {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        //wait for a {
        if (this.tokenizer.symbol() != "{") {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        this.compileStatments();
        //wait for a }
        if (this.tokenizer.symbol() != "}") {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        this.writeXMLContent("</whileStatement>\n");
    };
    AnalisadorSintatico.prototype.compileReturn = function () {
        console.log('entered compileReturn');
        this.writeXMLContent("<returnStatement>\n");
        if (this.tokenizer.keyWord() != "return") {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        if (this.tokenizer.symbol() != ";") {
            //wait for a expression
            this.compileExpression();
        }
        if (this.tokenizer.symbol() != ";") {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        this.writeXMLContent("</returnStatement");
    };
    AnalisadorSintatico.prototype.compileIf = function () {
        console.log('entered compileIf');
        this.writeXMLContent("<ifStatement>\n");
        if (this.tokenizer.keyWord() != "if") {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        //wait for a (
        if (this.tokenizer.symbol() != "(") {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        this.compileExpression();
        //wait for )
        if (this.tokenizer.symbol() != ")") {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        //expect {
        if (this.tokenizer.symbol() != "{") {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        this.compileStatments();
        //wait for a }
        if (this.tokenizer.symbol() != "}") {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        if (this.tokenizer.keyWord() == "else") {
            this.writeXMLContent(this.tokenizer.printToken());
            this.tokenizer.advance();
            this.compileStatments();
            if (this.tokenizer.symbol() != "}") {
                return false;
            }
            this.writeXMLContent(this.tokenizer.printToken());
            this.tokenizer.advance();
        }
        this.writeXMLContent("</ifStatement>\n");
    };
    AnalisadorSintatico.prototype.compileExpression = function () {
        console.log('entered compileExpression');
        this.writeXMLContent("<expression>\n");
        this.compileTerm();
        while (["+", "-", "*", "/", "&", "|", "<", ">\n", "="].includes(this.tokenizer.symbol())) {
            this.writeXMLContent(this.tokenizer.printToken());
            this.tokenizer.advance();
            this.compileTerm();
        }
        this.writeXMLContent("</expression>\n");
    };
    AnalisadorSintatico.prototype.compileTerm = function () {
        console.log('entered compileTerm');
        this.writeXMLContent("<term>\n");
        var term = false;
        if (this.tokenizer.intVal()) {
            term = true;
            this.writeXMLContent(this.tokenizer.printToken());
        }
        else if (this.tokenizer.stringVal()) {
            term = true;
            this.writeXMLContent(this.tokenizer.printToken());
        }
        else if (this.tokenizer.keyWord()) {
            if (!["true", "false", "null", "this"].includes(this.tokenizer.keyWord())) {
                return false;
            }
            term = true;
            this.writeXMLContent(this.tokenizer.printToken());
        }
        else if (this.tokenizer.symbol() == "(") {
            this.writeXMLContent(this.tokenizer.printToken());
            this.tokenizer.advance();
            this.compileExpression();
            if (this.tokenizer.symbol() != ")") {
                return false;
            }
            term = true;
            this.writeXMLContent(this.tokenizer.printToken());
        }
        else if (["-", "~"].includes(this.tokenizer.symbol())) {
            this.writeXMLContent(this.tokenizer.printToken());
            this.tokenizer.advance();
            this.compileTerm();
        }
        else if (this.tokenizer.identifier()) {
            this.writeXMLContent(this.tokenizer.printToken());
            this.tokenizer.advance();
            if (this.tokenizer.symbol() == "[") {
                this.writeXMLContent(this.tokenizer.printToken());
                this.tokenizer.advance();
                this.compileExpression();
                if (this.tokenizer.symbol() != "]") {
                    return false;
                }
                term = true;
                this.writeXMLContent(this.tokenizer.printToken());
            }
            else if (this.tokenizer.symbol() == "(") {
                this.tokenizer.advance();
                this.compileExpressionList();
                this.tokenizer.advance();
                //wait for )
                if (this.tokenizer.symbol() != ")") {
                    return false;
                }
                term = true;
                this.writeXMLContent(this.tokenizer.printToken());
            }
            else if (this.tokenizer.symbol() == ".") {
                this.writeXMLContent(this.tokenizer.printToken());
                this.tokenizer.advance();
                if (!this.tokenizer.identifier()) {
                    return false;
                }
                this.writeXMLContent(this.tokenizer.printToken());
                this.tokenizer.advance();
                if (this.tokenizer.symbol() != "(") {
                    return false;
                }
                this.writeXMLContent(this.tokenizer.printToken());
                this.tokenizer.advance();
                this.compileExpressionList();
                if (this.tokenizer.symbol() != ")") {
                    return false;
                }
                term = true;
                this.writeXMLContent(this.tokenizer.printToken());
            }
        }
        if (term = true) {
            this.tokenizer.advance();
        }
        this.writeXMLContent("</term>\n");
    };
    AnalisadorSintatico.prototype.compileExpressionList = function () {
        console.log('entered compileExpressionList');
        this.writeXMLContent("<expressionList>\n");
        this.compileExpression();
        while (this.tokenizer.symbol() == ",") {
            this.writeXMLContent(this.tokenizer.printToken());
            this.tokenizer.advance();
            this.compileExpression();
        }
        this.writeXMLContent("</expressionList>\n");
    };
    AnalisadorSintatico.prototype.compileSubroutineCall = function () {
        console.log('entered compileSubroutineCall');
        if (!this.tokenizer.identifier()) {
            return false;
        }
        this.writeXMLContent(this.tokenizer.printToken());
        this.tokenizer.advance();
        if (this.tokenizer.symbol() == "(") {
            this.writeXMLContent(this.tokenizer.printToken());
            this.tokenizer.advance();
            this.compileExpressionList();
            //wait for )
            if (this.tokenizer.symbol() != ")") {
                return false;
            }
            this.writeXMLContent(this.tokenizer.printToken());
        }
        else if (this.tokenizer.symbol() == ".") {
            this.writeXMLContent(this.tokenizer.printToken());
            this.tokenizer.advance();
            //wait a identifier for method name
            if (!this.tokenizer.identifier()) {
                return false;
            }
            this.writeXMLContent(this.tokenizer.printToken());
            this.tokenizer.advance();
            //wait for a (
            if (this.tokenizer.symbol() != "(") {
                return false;
            }
            this.writeXMLContent(this.tokenizer.printToken());
            this.tokenizer.advance();
            this.compileExpressionList();
            if (this.tokenizer.symbol() != ")") {
                return false;
            }
            this.writeXMLContent(this.tokenizer.printToken());
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
    AnalisadorSintatico.prototype.writeXMLContent = function (xmlContent) {
        this.xmlContent += xmlContent;
    };
    AnalisadorSintatico.prototype.writeXML = function () {
        console.log(this.xmlContent);
        fs.writeFile('compile.xml', this.xmlContent, function (err) {
            console.log(err);
        });
    };
    return AnalisadorSintatico;
}());
exports.AnalisadorSintatico = AnalisadorSintatico;
