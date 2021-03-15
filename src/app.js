"use strict";
exports.__esModule = true;
exports.Tokenizer = exports.TYPE = void 0;
var fs = require("fs");
var TYPE;
(function (TYPE) {
    TYPE["keyword"] = "keyword";
    TYPE["symbol"] = "symbol";
    TYPE["identifier"] = "identifier";
    TYPE["number"] = "number";
    TYPE["string"] = "string";
})(TYPE = exports.TYPE || (exports.TYPE = {}));
var idenRegex = "[a-zA-Z_]+[a-zA-Z0-9_]*";
var numberRegex = "[0-9]+";
var symbolRegex = "^([{|}|(|)|\\[|\\]|+|-|*|.|,|&|<|>|=|~|\\/|])$";
var keywordRegex = "[field|static|var|int|function|method|\
                         class|constructor|null|this|let|do|if|\
                         else|char|boolean|void|true|false|while|return]*";
var _stringRegex = "\"(\S*\s*)*\"";
//DATA CONFIG AS ARRAY
var _keywords = [
    "class", "constructor", "function", "method",
    "field", "static", "var", "int", "char", "boolean",
    "void", "true", "false", "null", "this", "let", "do",
    "if", "else", "while", "return"
];
var _symbol = ["{", "}", "(", ")", "[", "]", ".", ",", ";", "+", "-", "*", "/", "&", "|", "<", ">", "=", "~"];
var _integerConstant = "\d{1,5}";
var _stringConstant = "\"(\S*\s*)*\"";
var _identifier = "\w+";
var _space = "\n|\t| ";
var Tokenizer = /** @class */ (function () {
    function Tokenizer(jackFile) {
        var _this = this;
        this.type = null; //variable that contains type of token
        this.indexLine = 0; //variable that receive current line
        this.token = null; //variable that receive current token
        this.JackFile = new Array(); //receive lines of jack file
        /* VARIABLES FOR CONTROL */
        this.currentLine = ""; // the current line of the input
        this.currentWords = []; // the current words of the line. splitted by whitespace
        this.position = 0; // the current position of word in currentWords
        this.currentWord = ""; // the current processing word
        fs.writeFile('compile.xml', "", function (err) {
            // throws an error, you could also catch it here
            if (err) {
                console.log('error write file ', err);
                throw err;
            }
            // success case, the file was saved
            console.log('compile.xml saved');
        });
        fs.readFile(jackFile, 'utf8', function (err, data) {
            if (err) {
                console.log("error read File.Jack");
                console.log(err);
                throw err;
            }
            //console.log("JackFile readed");
            console.log(data);
            console.log(data.length);
            _this.JackFile = data.split("\n");
            //console.log(this.JackFile[0])
            //.replace(/(\r\n|\n|\r)/g,""); //.split(/\r?\n/);
            _this.token = "";
            _this.type = "";
            //this.advance();
        });
        /* setTimeout(()=>
         {
             console.log("<tokens>");
             while(this.hasMoreTokens())
             {
                 this.advance();
                 console.log(`  <${this.type}>`);
                 console.log(`       <token>${this.token}</token>`);
                 console.log(`  </${this.type}>`)
                // this.advance();
             }
             console.log("</tokens>");
 
         },3000);*/
        /*const readStream = fs.createReadStream(jackFile, 'utf8');

        readStream.on('data', (chunk) => {
            this.indexLine += chunk;
        }).on('end', (data:any) => {
            console.log(data);
        });*/
    }
    Tokenizer.prototype.hasMoreTokens = function () {
        if (this.indexLine < this.JackFile.length) {
            //console.log('hasMoreTokens true');
            return true;
        }
        //console.log('hasMoreTokens false');
        return false;
    };
    Tokenizer.prototype.advance = function () {
        if (!this.hasMoreTokens()) {
            return false;
        }
        this.currentLine = this.JackFile[this.indexLine];
        this.currentWords = this.currentLine.split(" ");
        //console.log('currentWords');
        //console.log(this.currentWords);
        //while(this.position < this.currentWords.length)
        //{
        if (this.currentWords[this.position] != " " && this.currentWords[this.position] != "") {
            this.currentWord = this.currentWords[this.position].replace(/[\r\n\t]/g, "");
            ;
            this.token = this.currentWord;
            this.type = this.tokenType();
            //console.log("token ", this.token, " tokenType ", this.type); 
        }
        this.position++;
        //}
        if (this.position >= this.currentWords.length) {
            //console.log('change line');
            this.position = 0;
            this.indexLine++;
        }
    };
    Tokenizer.prototype.tokenType = function () {
        if (_keywords.includes(this.token)) {
            return TYPE.keyword;
        }
        if (_symbol.includes(this.token)) {
            return TYPE.symbol;
        }
        /*const regKeyword = new RegExp(keywordRegex).exec(this.token);
        if(regKeyword)
        {
            return TYPE.keyword;
        }

        const regSymble = new RegExp(symbolRegex).exec(this.token);
        if(regSymble)
        {
            return TYPE.symbol;
        }*/
        var regInterger = new RegExp(numberRegex).exec(this.token);
        if (regInterger) {
            return TYPE.number;
        }
        var regString = new RegExp(_stringRegex).exec(this.token);
        if (regString) {
            return TYPE.string;
        }
        var regIdentifier = new RegExp(idenRegex).exec(this.token);
        if (regIdentifier) {
            return TYPE.identifier;
        }
        return "";
    };
    Tokenizer.prototype.keyWord = function () {
        /*const regex = new RegExp(keywordRegex).exec(this.token);
        console.log(regex);
        if(regex)
        {
            this.type = TYPE.keyword
            return this.type;
        }
        return "";*/
        if (_keywords.includes(this.token)) {
            return this.token;
        }
    };
    Tokenizer.prototype.symbol = function () {
        /*const regex = new RegExp(symbolRegex).exec(this.token);
        //console.log(regex.exec(token));
        if(regex && regex.indexOf(this.token))
        {
            return this.token;
        }
        return "";*/
        if (_symbol.includes(this.token)) {
            return this.token;
        }
    };
    Tokenizer.prototype.identifier = function () {
        /*const regex = new RegExp(idenRegex).exec(this.token);
        //console.log(regex.exec(token));
        if(regex)
        {
            return this.token; //.type = TYPE.identifier;
        }
        return "";*/
        if (this.tokenType() == 'identifier') {
            return this.token;
        }
    };
    Tokenizer.prototype.intVal = function () {
        /*const regex = new RegExp(numberRegex).exec(this.token);
        //console.log(regex.exec(token));
        if(regex)
        {
            //this.type = TYPE.number;
            return this.token;
        }
        return "";*/
        if (this.tokenType() == 'number') {
            return this.token;
        }
    };
    Tokenizer.prototype.stringVal = function () {
        /*const regex = new RegExp("\".*\"").exec(this.token);
         if(regex)
         {
             //this.type = TYPE.string;
             return this.token;
         }
 
         return "";*/
        if (this.tokenType() == 'string') {
            return this.token;
        }
    };
    Tokenizer.prototype.printToken = function () {
        console.log('ENTERED PRINT TOKEN');
        if (this.tokenType() == TYPE.keyword) {
            console.log("<keyword>" + this.token + "</keyword>");
            return "<keyword>" + this.token + "</keyword>";
        }
        else if (this.tokenType() == TYPE.symbol) {
            if (this.token == "<") {
                console.log("<symbol> &lt; </symbol>");
                return "<symbol> &lt; </symbol>";
            }
            else if (this.token == ">") {
                console.log("<symbol> &gt; </symbol>");
                return "<symbol> &gt; </symbol>";
            }
            else if (this.token == "&") {
                console.log("<symbol> &gt; </symbol>");
                return "<symbol> &gt; </symbol>";
            }
            else {
                console.log("<symble> " + this.token + " </symble>");
                return "<symble> " + this.token + " </symble>";
            }
        }
        else if (this.tokenType() == TYPE.identifier) {
            console.log("<identifier> " + this.token + " </identifier>");
            return "<identifier> " + this.token + " </identifier>";
        }
        else if (this.tokenType() == TYPE.number) {
            console.log("<interger> " + this.token + " </interger>");
            return "<interger> " + this.token + " </interger>";
        }
        else if (this.tokenType() == TYPE.string) {
            console.log("<string> " + this.token + " </string>");
            return "<string> " + this.token + " </string>";
        }
        else {
            console.log("token: " + this.token);
            return "token: " + this.token;
        }
    };
    return Tokenizer;
}());
exports.Tokenizer = Tokenizer;
