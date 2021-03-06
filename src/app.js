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
        this.currentLine = ""; //current line
        this.currentWords = []; //current words of the line
        this.position = 0; //current position of word in currentWords
        this.currentWord = ""; //current word
        fs.writeFile('compile.xml', "", function (err) {
            // throws an error, you could also catch it here
            if (err) {
                //console.log('error write file ', err);
                throw err;
            }
            // success case, the file was saved
            //console.log('compile.xml saved');
        });
        fs.readFile(jackFile, 'utf8', function (err, data) {
            if (err) {
                //console.log("error read File.Jack");
                //console.log(err);
                throw err;
            }
            //console.log("JackFile readed");
            //console.log(data);
            //console.log(data.length)
            _this.JackFile = data.split("\n");
            //console.log('DATA FROM JACK')
            //console.log(this.JackFile)
            //.replace(/(\r\n|\n|\r)/g,""); //.split(/\r?\n/);
            _this.token = "";
            _this.type = "";
            //this.advance();
        });
        /*setTimeout(()=>
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
        //console.log('entered advance');
        if (!this.hasMoreTokens()) {
            return false;
        }
        this.currentLine = this.JackFile[this.indexLine];
        console.log('CURRENT LINE ');
        console.log(this.currentLine);
        this.currentWords = this.currentLine.split(" ")
            .map(function (ele) { return ele.replace(/(\r\n|\n|\r)/gm, "").trim(); }) //replace(/(\r\n|\n|\r)/gm, "")
            .filter(function (ele) {
            if (ele) {
                return true;
            }
        });
        console.log('CURRENT WORDS');
        console.log(this.currentWords);
        //if(this.currentWords[this.position] != " " &&  this.currentWords[this.position] != "")
        //{
        this.currentWord = this.currentWords[this.position].replace(/[\r\n\t]/g, "").trim();
        this.token = this.currentWord;
        this.type = this.tokenType();
        console.log("token ", this.token, " tokenType ", this.type);
        //}
        this.position++;
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
        //console.log('regex identifier ', regIdentifier);
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
        /*console.log('condition keyword ', this.tokenType() == TYPE.keyword);

        if(this.tokenType() == TYPE.keyword)
        {
            return this.token;
        }

        return "";*/
        //console.log('keyword token0 ', this.token);
        //console.log('condition keyword ', _keywords.includes(this.token));
        if (_keywords.includes(this.token)) {
            //console.log('keyword token ', this.token);
            return this.token;
        }
        return "";
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
        //console.log('identifier()', this.token) ;
        //console.log('identifier condition ', this.tokenType() == 'identifier');
        console.log('TOKENTYPE 22 ', this.tokenType());
        if (this.tokenType() == 'identifier') {
            return this.token;
        }
        return "";
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
        //console.log('ENTERED PRINT TOKEN');
        if (this.tokenType() == TYPE.keyword) {
            //console.log(`<keyword>${this.token}</keyword>`);
            return "<keyword>" + this.token + "</keyword>\n";
        }
        else if (this.tokenType() == TYPE.symbol) {
            if (this.token == "<") {
                //console.log("<symbol> &lt; </symbol>");
                return "<symbol> &lt; </symbol>\n";
            }
            else if (this.token == ">") {
                //console.log("<symbol> &gt; </symbol>");
                return "<symbol> &gt; </symbol>\n";
            }
            else if (this.token == "&") {
                //console.log("<symbol> &gt; </symbol>");
                return "<symbol> &gt; </symbol>\n";
            }
            else {
                //console.log(`<symble> ${this.token} </symble>`);
                return "<symble> " + this.token + " </symble>\n";
            }
        }
        else if (this.tokenType() == TYPE.identifier) {
            //console.log(`<identifier> ${this.token} </identifier>`)
            return "<identifier> " + this.token + " </identifier>\n";
        }
        else if (this.tokenType() == TYPE.number) {
            //console.log(`<interger> ${this.token} </interger>`);
            return "<interger> " + this.token + " </interger>\n";
        }
        else if (this.tokenType() == TYPE.string) {
            //console.log(`<string> ${this.token} </string>`);
            return "<string> " + this.token + " </string>\n";
        }
        else {
            //console.log(`token: ${this.token}`)
            return "token: " + this.token;
        }
    };
    return Tokenizer;
}());
exports.Tokenizer = Tokenizer;
