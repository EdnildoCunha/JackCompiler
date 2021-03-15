import * as fs from 'fs';

export enum TYPE{
    keyword = 'keyword',
    symbol = 'symbol',
    identifier = 'identifier',
    number = "number",
    string = "string"
}

const idenRegex:string = "[a-zA-Z_]+[a-zA-Z0-9_]*";
const numberRegex:string = "[0-9]+";
const symbolRegex = "^([{|}|(|)|\\[|\\]|+|-|*|.|,|&|<|>|=|~|\\/|])$";
const keywordRegex:string = "[field|static|var|int|function|method|\
                         class|constructor|null|this|let|do|if|\
                         else|char|boolean|void|true|false|while|return]*";
const _stringRegex = "\"(\S*\s*)*\"";



//DATA CONFIG AS ARRAY

const _keywords:string[] = 
[
    "class", "constructor", "function", "method", 
    "field", "static", "var","int", "char", "boolean", 
    "void", "true", "false", "null", "this", "let", "do",
    "if", "else", "while", "return"
 ]

 const _symbol = ["{", "}", "(", ")", "[", "]", ".", ",", ";", "+", "-", "*", "/", "&", "|", "<", ">", "=", "~"]
 const _integerConstant = "\d{1,5}"
 const _stringConstant = "\"(\S*\s*)*\""
 const _identifier = "\w+"
 const _space = "\n|\t| "

export class Tokenizer
{
    private type:any = null;//variable that contains type of token
    private indexLine:number = 0;//variable that receive current line
    private token:any = null; //variable that receive current token
    private JackFile:string[] = new Array<string>();//receive lines of jack file

    /* VARIABLES FOR CONTROL */

    private currentLine:string = ""; //current line
    private currentWords:string[] = []; //current words of the line
    private position:number = 0;  //current position of word in currentWords
    private currentWord:string = ""; //current word

    constructor(jackFile:any)
    {


        fs.writeFile('compile.xml', "", (err) => {
            // throws an error, you could also catch it here
            if (err){
                console.log('error write file ', err);
                throw err;
            } 
        
            // success case, the file was saved
            console.log('compile.xml saved');
        });

        fs.readFile(jackFile, 'utf8', (err, data) => {
            if (err)
            {
                console.log("error read File.Jack");
                console.log(err);
                throw err;
            }
            //console.log("JackFile readed");
            console.log(data);
            console.log(data.length)
            this.JackFile = data.split("\n"); 
            //console.log(this.JackFile[0])
              //.replace(/(\r\n|\n|\r)/g,""); //.split(/\r?\n/);
            this.token = "";
            this.type = "";

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

    }


    hasMoreTokens():boolean
    {
        if(this.indexLine < this.JackFile.length)
        {
            //console.log('hasMoreTokens true');
            return true;
        }
        //console.log('hasMoreTokens false');
        return false;
    }

    advance()
    {
        if(!this.hasMoreTokens())
        {
            return false;
        }

        this.currentLine = this.JackFile[this.indexLine];
        this.currentWords = this.currentLine.split(" ");
        //console.log('currentWords');
        //console.log(this.currentWords);

            if(this.currentWords[this.position] != " " &&  this.currentWords[this.position] != "")
            {
                this.currentWord = this.currentWords[this.position].replace(/[\r\n\t]/g, "");;
                this.token = this.currentWord;
                this.type = this.tokenType()
                //console.log("token ", this.token, " tokenType ", this.type); 
            }
            this.position++;

        if( this.position >=  this.currentWords.length)
        {   
            //console.log('change line');
            this.position = 0;
            this.indexLine++;
        }
        
        
    }

    tokenType():string
    {
        if(_keywords.includes(this.token))
        {
            return TYPE.keyword;
        }

        if(_symbol.includes(this.token))
        {
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

        const regInterger = new RegExp(numberRegex).exec(this.token);
        if(regInterger)
        {
            return TYPE.number;
        }

        const regString = new RegExp(_stringRegex).exec(this.token);
        if(regString)
        {
            return TYPE.string;
        }

        const regIdentifier = new RegExp(idenRegex).exec(this.token);
        if(regIdentifier)
        {
            return TYPE.identifier;
        }

        return "";
    }

    keyWord()
    {
        /*const regex = new RegExp(keywordRegex).exec(this.token);
        console.log(regex);
        if(regex)
        {
            this.type = TYPE.keyword
            return this.type;
        }   
        return "";*/

        if(_keywords.includes(this.token))
        {
            return this.token;
        }
    }

    symbol()
    {
        /*const regex = new RegExp(symbolRegex).exec(this.token);
        //console.log(regex.exec(token));
        if(regex && regex.indexOf(this.token))
        {
            return this.token;
        }   
        return "";*/

        if(_symbol.includes(this.token))
        {
            return this.token;
        }
    }

    identifier()
    {
        /*const regex = new RegExp(idenRegex).exec(this.token);
        //console.log(regex.exec(token));
        if(regex)
        {
            return this.token; //.type = TYPE.identifier;
        }   
        return "";*/

        if(this.tokenType() == 'identifier'){
            return this.token;
        }
    }

    intVal()
    {
        /*const regex = new RegExp(numberRegex).exec(this.token);
        //console.log(regex.exec(token));
        if(regex)
        {
            //this.type = TYPE.number;
            return this.token;
        }   
        return "";*/

        if(this.tokenType() == 'number'){
            return this.token;
        }

    }

    stringVal()
    {
       /*const regex = new RegExp("\".*\"").exec(this.token);
        if(regex)
        {
            //this.type = TYPE.string;
            return this.token;
        }

        return "";*/

        if(this.tokenType() == 'string'){
            return this.token;
        }

    }

    printToken()
    {
        console.log('ENTERED PRINT TOKEN');
        if(this.tokenType() == TYPE.keyword)
        {
            console.log(`<keyword>${this.token}</keyword>`);
            return `<keyword>${this.token}</keyword>`;   
        }
        else if(this.tokenType() == TYPE.symbol)
        {
            if(this.token == "<")
            {
                console.log("<symbol> &lt; </symbol>");
                return "<symbol> &lt; </symbol>"; 
            }
            else if(this.token == ">")
            {
                console.log("<symbol> &gt; </symbol>");
                return "<symbol> &gt; </symbol>";
            }
            else if(this.token == "&")
            {
                console.log("<symbol> &gt; </symbol>");
                return "<symbol> &gt; </symbol>";
            }
            else
            {
                console.log(`<symble> ${this.token} </symble>`);
                return `<symble> ${this.token} </symble>`
            }
        }
        else if(this.tokenType() == TYPE.identifier)
        {
            console.log(`<identifier> ${this.token} </identifier>`)
            return `<identifier> ${this.token} </identifier>`;
        }
        else if(this.tokenType() == TYPE.number)
        {
            console.log(`<interger> ${this.token} </interger>`);
            return `<interger> ${this.token} </interger>`;
        }
        else if(this.tokenType() == TYPE.string)
        {
            console.log(`<string> ${this.token} </string>`);
            return `<string> ${this.token} </string>`;
        }
        else 
        {
            console.log(`token: ${this.token}`)
            return `token: ${this.token}`;
        }
    }

}