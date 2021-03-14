import { Tokenizer } from './app';

const keyword = "[\
    class | constructor | function |method | field | static | var |int | char | boolean | void |true |false | null | this | let | do |if | else | while | return \
]";

const expressions = "[{ | } | ( | ) | [ | ] | . |, | ; | + | - |  | /* | & || | < | > | = | ~ \
]";


class AnalisadorSintatico{

    tokenizer = new Tokenizer('');
    private jackFile:any;
    constructor(jackFile:any)
    {
        this.jackFile = jackFile;
    }

    compileClass()
    {
        this.tokenizer.advance();
        //aqui  precisa adicionar o arquivo
        if(this.tokenizer.keyWord() != 'class')
        {   
            //wait for a class here
            return false;
        }

        this.tokenizer.advance();

        if(!this.tokenizer.identifier())
        {
            return false;
        }

        this.tokenizer.advance();

        if(this.tokenizer.symbol() != "identifier"){
            return false;
        }

        this.tokenizer.advance();
        //verifica se a alguma declaração de variáveis
        while(
                this.tokenizer.keyWord().indexOf("static") != -1 ||
                this.tokenizer.keyWord().indexOf("field") != -1
            ){
                this.compileClassVarDec();
            }

        while(
                this.tokenizer.keyWord().includes("constructor", "function", "method")
            ){
                this.compileSubtoutine();
            }

        //AJUSTAR AQUI    
        if(this.tokenizer.symbol() != "identifier"){
                return false;
            }

    

    }

    compileClassVarDec()
    {
        //compiles a declaration when it is a field or static 
        if(!this.tokenizer.keyWord().contains(["static", "field"])){
            return false;
        }

        this.tokenizer.advance();

        if(!this.tokenizer.identifier() && !this.tokenizer.keyWord().includes("int", "char", "boolean")){
            return false;
        }

        this.tokenizer.advance();

        if(!this.tokenizer.identifier()){
            return false;
        }

        this.tokenizer.advance();

        //check for and varname

        while(
                this.tokenizer.symbol() == ","
            ){
            this.tokenizer.advance();
            //wait for identifier
            if(!this.tokenizer.identifier()){
                return false;
            }

            this.tokenizer.advance();
        }


        if(this.tokenizer.symbol() != ";")
        {
            return false;
        }

        this.tokenizer.advance();

    }

    compileSubtoutine(){
        //compile constructor, function or method
        if(!["constructor", "function", "method"].includes(this.tokenizer.keyWord()))
        {
            return false;
        }
        
        this.tokenizer.advance();

        if(!this.tokenizer.identifier() && !["void", "int", "char", "boolean"].includes(this.tokenizer.keyWord())){
            return false;
        }

        this.tokenizer.advance();

        //wait for a function name
        if(!this.tokenizer.identifier()){
            return false;
        }

        this.tokenizer.advance();

        //check parameter list
        this.compileList();

        //await )
        if(this.tokenizer.symbol() != ")"){
            return false;
        }

        this.tokenizer.advance();

        if(this.tokenizer.symbol() != "{"){
            return false;
        }

        //wait for var declaration
        this.tokenizer.advance();
        while(
            this.tokenizer.keyWord() == "var"
        ){
            this.compileVarDec();
        }

        //wait statments 
        while(
            this.tokenizer.keyWord().contains("let", "if", "while", "do", "return")
        ){
            this.compileStatments();
        }

        //wait for } to end subroutine
        if(this.tokenizer.symbol() != "}"){
            return false;
        }

        this.tokenizer.advance();

    }

    compileList(){
        if(!["void", "int", "char", "boolean"].includes(this.tokenizer.keyWord()) && !this.tokenizer.identifier()){
            return false;
        }   
        this.tokenizer.advance();

        //wait for var name
        if(!this.tokenizer.identifier()){
            return false;
        }  

        this.tokenizer.advance();

        while(
            this.tokenizer.symbol() == ","
        ){
            this.tokenizer.advance()

            if(!["int", "char", "boolean"].includes(this.tokenizer.keyWord()) && !this.tokenizer.identifier()){
                return false;
            }

            this.tokenizer.advance();
            //wait for var name
            if(!this.tokenizer.identifier()){
                return false;
            }

            this.tokenizer.advance();

        }
    }


    compileVarDec()
    {
        //wait for a var declaration
        if(this.tokenizer.keyWord() != "var"){
            return false;
        }  

        this.tokenizer.advance();

        //expected a var type
        if(!["int", "char", "boolean"].includes(this.tokenizer.keyWord()) && !this.tokenizer.identifier())
        {
            return false;
        }

        this.tokenizer.advance();

        if(
            this.tokenizer.tokenType() != this.tokenizer.tokenType() && 
            this.tokenizer.tokenType() == "identifier")
        {//JackTokenizer.Identifier
            return false;
        }

        this.tokenizer.advance();

        while(
            this.tokenizer.symbol() == ","
        )
        {
            this.tokenizer.advance();
            if(!this.tokenizer.identifier()){
                return false;
            }
            this.tokenizer.advance();
        }

        if(this.tokenizer.symbol() != ";")
        {
            return false;
        }

        this.tokenizer.advance();

    }

    compileStatments()
    {
        'wait for a sequence of statements, not includind {}'
        while
        (
            ["let", "if", "while", "do", "return"].includes(this.tokenizer.keyWord())
        ){
            switch(this.tokenizer.keyWord())
            {
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
    }

    compileDo()
    {
        if(this.tokenizer.keyWord() != "do"){
            return false;
        }

        this.tokenizer.advance();

        //wait subroutine
        this.compileSubtoutine();

        //wait for ;
        if(this.tokenizer.symbol() != ";")
        {
            return false;
        }

        this.tokenizer.advance();
    }


    compileLet(){
        //wait for a let statement
        if(this.tokenizer.keyWord() != "let")
        {
            return false;
        }

        this.tokenizer.advance();

        if(this.tokenizer.symbol() == "["){
            this.tokenizer.advance();
            this.compileExpression();

            if(this.tokenizer.symbol() != "]"){
                return false;
            }

            this.tokenizer.advance();            

        }

        //wait for =
        if(this.tokenizer.symbol() != "="){
            return false;
        }

        this.tokenizer.advance();

        this.compileExpression();

        if(this.tokenizer.symbol() != ";"){
            return false;
        }

        this.tokenizer.advance();

    }

    compileWhile()
    {
        //compile wait statement
        if(this.tokenizer.keyWord() != 'while')
        {
            return false;
        }    
        this.tokenizer.advance();
        //wait for a (
        if(this.tokenizer.symbol() != "(")
        {   
            return false;
        }

        this.tokenizer.advance();

        this.compileExpression();

        //wait for a )
        if(this.tokenizer.symbol() != ")")
        {
            return false;
        }

        this.tokenizer.advance();

        //wait for a {
        if(this.tokenizer.symbol() != "{"){
            return false;
        }

        this.tokenizer.advance();
        this.compileStatments();

        //wait for a }
        if(this.tokenizer.symbol() != "}")
        {
            return false;
        }

        this.tokenizer.advance();
    }

    compileReturn()
    {
       if(this.tokenizer.keyWord() != "return")
       {
           return false;
       } 

       this.tokenizer.advance();

       if(this.tokenizer.symbol() != ";")
       {
            //wait for a expression
            this.compileExpression();
       }

       if(this.tokenizer.symbol() != ";")
       {
           return false;
       }

       this.tokenizer.advance();

    }


    compileIf()
    {
        if(this.tokenizer.keyWord() != "if")
        {
            return false;
        }

        this.tokenizer.advance();

        //wait for a (
        if(this.tokenizer.symbol() != "(")
        {
            return false;
        }

        this.tokenizer.advance();

        this.compileExpression()

        //wait for )
        if(this.tokenizer.symbol() != ")")
        {
            return false;
        }

        this.tokenizer.advance();

        //expect {
        if(this.tokenizer.symbol() != "{")
        {
            return false;
        }

        this.tokenizer.advance();

        this.compileStatments();

        //wait for a }
        if(this.tokenizer.symbol() != "}")
        {
            return false;
        }

        this.tokenizer.advance();
    
        if(this.tokenizer.keyWord() == "else")
        {
            this.tokenizer.advance();
            this.compileStatments();

            if(this.tokenizer.symbol() != "}")
            {
                return false;
            }

            this.tokenizer.advance();

        }

    }

    compileExpression()
    {
        this.compileTerm();

        while
        (
            ["+", "-", "*", "/", "&", "|", "<", ">", "="].includes(this.tokenizer.symbol())
        )
        {
            this.tokenizer.advance();
            this.compileTerm();
        }
    }

    compileTerm()
    {
        let thisisterm:boolean = false;
        if(this.tokenizer.intVal())
        {
            thisisterm = true;   
        }
        else if(this.tokenizer.stringVal())
        {
            thisisterm = true;   
        }
        else if(this.tokenizer.keyWord())
        {
            const keyterm = this.tokenizer.keyWord();
            if(!["true", "false", "null", "this"].includes(keyterm))
            {
                return false;
            }

            thisisterm = true
        }
        else if(this.tokenizer.symbol() == "(")
        {
            //this.tokenizer.printToken();
            this.tokenizer.advance();
            this.compileExpression();

            if(this.tokenizer.symbol() != ")")
            {
                return false;
            }

            thisisterm = true   
        }
        else if(["-", "~"].includes(this.tokenizer.symbol()))
        {
            this.tokenizer.advance();
            this.compileTerm();
        }

        else if(this.tokenizer.identifier())
        {
            this.tokenizer.advance();
            if(this.tokenizer.symbol() == "[")
            {
                this.tokenizer.advance();
                this.compileExpression();

                if(this.tokenizer.symbol() != "]")
                {
                    return false;
                }

                thisisterm = true;

            }
            else if(this.tokenizer.symbol() == "(")
            {
                this.tokenizer.advance();
                this.compileExpressionList();
                this.tokenizer.advance();
                //wait for )
                if(this.tokenizer.symbol() != ")")
                {
                    return false;
                }
                thisisterm = true;
            }
            else if(this.tokenizer.symbol() == ".")
            {
                this.tokenizer.advance();
                if(!this.tokenizer.identifier())
                {
                    return false;
                }

                this.tokenizer.advance();

                if(this.tokenizer.symbol() != "(")
                {
                    return false;
                }

                this.compileExpressionList();

                if(this.tokenizer.symbol() != ")")
                {
                    return false;
                }
            }

        }

        if(thisisterm = true)
        {
            this.tokenizer.advance();
        }

    }


    compileExpressionList()
    {
     
        this.compileExpression();

        while(this.tokenizer.symbol()== ",")
        {
            this.tokenizer.advance();
            this.compileExpression();
        }
        
    }

    compileSubroutineCall()
    {
        if(!this.tokenizer.identifier())
        {
            return false;
        }

        this.tokenizer.advance();

        if(this.tokenizer.symbol() == "(")
        {
            this.tokenizer.advance();
            this.compileExpressionList();

            //wait for )
            if(this.tokenizer.symbol() != ")")
            {
                return false;
            }
        }else if(this.tokenizer.symbol() == ".")
        {
            this.tokenizer.advance();
            //wait a identifier for method name
            if(!this.tokenizer.identifier())
            {
                return false;
            }

            this.tokenizer.advance();
            //wait for a (
            
            if(this.tokenizer.symbol() != "(")
            {
                return false;
            }

            this.tokenizer.advance();
            this.compileExpressionList();

            if(this.tokenizer.symbol() != ")")
            {
                return false;
            }
        }else
        {
            return false;
        }

        this.tokenizer.advance();
    }


}