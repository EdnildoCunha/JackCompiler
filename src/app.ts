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



class Tokenizer
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

    tokenType()
    {
        return this.type;
    }

    keyWord(token:string)
    {
        const regex = new RegExp(keywordRegex);
        console.log(regex.exec(token));
        if(regex)
        {
            this.type = TYPE.keyword
        }   
        return;
    }

    symbol(token:string)
    {
        const regex = new RegExp(symbolRegex);
        console.log(regex.exec(token));
        if(regex)
        {
            this.type = TYPE.symbol
        }   
        return;
    }

    identifier(token:string)
    {
        const regex = new RegExp(idenRegex);
        console.log(regex.exec(token));
        if(regex)
        {
            this.type = TYPE.identifier
        }   
        return;
    }

    intVal(token:string)
    {
        const regex = new RegExp(numberRegex);
        console.log(regex.exec(token));
        if(regex)
        {
            this.type = TYPE.number
        }   
        return;
    }

    stringVal(token:string)
    {
       const regex = new RegExp("\".*\"");
        if(regex.exec(token)){
            this.type = TYPE.string
        }
    }

}