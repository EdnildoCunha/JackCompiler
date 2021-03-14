enum TYPE{
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
    private type:any = null;//variable that contain type of token
    private indexLine:number = 0;//variable that receive current line
    private token:any = null; //variable that receive current token
    private JackFile:string[] = new Array<string>();//receive lines of jack file

    constructor(file:string)
    {

    } 

    hasMoreTokens():boolean
    {
        if(this.indexLine < this.JackFile.length)
        {
            return true;
        }
        return false;
    }

    advance()
    {
        if(!this.hasMoreTokens())
        {
            return false;
        }

        if(this.JackFile.length != 0)
        {
            this.JackFile.forEach((element)=>{
                if(element == ""){
                    this.indexLine++;
                    this.advance();
                }else{
                    const token = new RegExp("[a-zA-Z_]+[a-zA-Z0-9_]*|[0-9]+|[+|*|/|\-|{|}|(|)|\[|\]|\.|,|;|<|>|=|~]")
                                     .exec(element);
                    if(token)
                    {
                        this.indexLine++;
                        this.JackFile.push(token[0]);
                        this.token = this.JackFile.shift();
                    }
                    
                }
            })

            return;
        }

        this.indexLine++;
        this.token = this.JackFile.shift();
    }

    tokenType():string
    {
        const regKeyword = new RegExp(keywordRegex).exec(this.token);
        if(regKeyword)
        {
            return TYPE.keyword;
        }

        const regSymble = new RegExp(symbolRegex).exec(this.token);
        if(regSymble)
        {
            return TYPE.symbol;
        }

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
        const regex = new RegExp(keywordRegex).exec(this.token);
        console.log(regex);
        if(regex)
        {
            this.type = TYPE.keyword
            return this.type;
        }   
        return "";
    }

    symbol():string
    {
        const regex = new RegExp(symbolRegex).exec(this.token);
        //console.log(regex.exec(token));
        if(regex && regex.indexOf(this.token))
        {
            return this.token;
        }   
        return "";
    }

    identifier():string
    {
        const regex = new RegExp(idenRegex).exec(this.token);
        //console.log(regex.exec(token));
        if(regex)
        {
            return this.type = TYPE.identifier;
        }   
        return "";
    }

    intVal():string
    {
        const regex = new RegExp(numberRegex).exec(this.token);
        //console.log(regex.exec(token));
        if(regex)
        {
            this.type = TYPE.number;
        }   
        return "";
    }

    stringVal():string
    {
       const regex = new RegExp("\".*\"").exec(this.token);
        if(regex)
        {
            this.type = TYPE.string;
        }

        return "";
    }

}