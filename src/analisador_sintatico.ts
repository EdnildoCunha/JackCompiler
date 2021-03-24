import * as fs from "fs";
import { Tokenizer, TYPE } from './app';

const keyword = "[\
    class | constructor | function |method | field | static | var |int | char | boolean | void |true |false | null | this | let | do |if | else | while | return \
]";

const expressions = "[{ | } | ( | ) | [ | ] | . |, | ; | + | - |  | /* | & || | < | > | = | ~ \
]";

export class AnalisadorSintatico{

    tokenizer = new Tokenizer('Main.jack');
    private jackFile:any;
    private XMLFile:any = "";
    private xmlContent:string = "";
    constructor(jackFile:any)
    {
        try 
        {
            fs.readFile(jackFile, 'utf8', (err, data)=>{
                if(err)
                {
                    console.log('error in read file');
                    console.log(err);
                    throw err;;
                }

                console.log('Jack code');
                this.jackFile = data.split("\n");
                this.compileClass();

            })

            //const data = fs.readFileSync(jackFile, 'utf8');
            //console.log(data); 
            //this.jackFile = data.split("\n");

            /*this.XMLFile = fs.readFile('compile.xml', 'utf8', (err, data)=>{
                if (err)
                {
                    console.log(err);
                    throw err;
                }
                console.log('xml file ', data);
            })*/

            //this.compileClass();
            
        } catch(e) {
            console.log('Error:', e.stack);
        }

    }

    compileClass()
    {

        console.log('entered compileClass');
        this.writeXML("<class>");

        this.tokenizer.advance();

        setTimeout(()=>{
            console.log('3 second passed')
        }, 3500)

        //aqui  precisa adicionar o arquivo
        if(this.tokenizer.keyWord() != 'class')
        {   
            //wait for a class here
            return false;
        }

        this.writeXML(this.tokenizer.printToken());

        this.tokenizer.advance();

        if(!this.tokenizer.identifier())
        {
            return false;
        }

        this.writeXML(this.tokenizer.printToken());

        this.tokenizer.advance();

        if(this.tokenizer.symbol() != "{")
        {
            return false;
        }

        this.writeXML(this.tokenizer.printToken());

        this.tokenizer.advance();
        //verifica se a alguma declaração de variáveis
        while(
                this.tokenizer.keyWord().indexOf("static") != -1 ||
                this.tokenizer.keyWord().indexOf("field") != -1
            ){
                this.compileClassVarDec();
            }

        while(
                ["constructor", "function", "method"].includes(this.tokenizer.keyWord())
            ){
                this.compileSubtoutine();
            }

        //AJUSTAR AQUI    
        if(this.tokenizer.symbol() != "}")
        {
            return false;
        }

        this.writeXML(this.tokenizer.printToken());

        this.writeXML("</class>")

    }

    compileClassVarDec()
    {
        console.log('entered compileVardDec'); 
        this.writeXML("<classVarDec>")
        //compiles a declaration when it is a field or static 
        if(!["static", "field"].includes(this.tokenizer.keyWord()))
        {
            return false;
        }

        this.writeXML(this.tokenizer.printToken());

        this.tokenizer.advance();

        if(!this.tokenizer.identifier() && !["int", "char", "boolean"].includes(this.tokenizer.keyWord()))
        {
            return false;
        }

        this.writeXML(this.tokenizer.printToken());

        this.tokenizer.advance();

        if(!this.tokenizer.identifier())
        {
            return false;
        }

        this.writeXML(this.tokenizer.printToken());

        this.tokenizer.advance();

        //check for and varname

        while(
                this.tokenizer.symbol() == ","
            )
            {
            
                this.tokenizer.advance();
            
            //wait for identifier
            if(!this.tokenizer.identifier())
            {
                return false;
            }

            this.writeXML(this.tokenizer.printToken());

            this.tokenizer.advance();
        }


        if(this.tokenizer.symbol() != ";")
        {
            return false;
        }

        this.writeXML(this.tokenizer.printToken());

        this.tokenizer.advance();

        this.writeXML("</classVarDec>")
    }


    compileSubtoutine()
    {
        console.log('entered compileSuboutine');
        this.writeXML("<subroutineDec>")
        //compile constructor, function or method
        if(!["constructor", "function", "method"].includes(this.tokenizer.keyWord()))
        {
            return false;
        }
        
        this.writeXML(this.tokenizer.printToken());

        this.tokenizer.advance();

        if(
            !this.tokenizer.identifier() && 
            !["void", "int", "char", "boolean"].includes(this.tokenizer.keyWord())){
            return false;
        }

        this.writeXML(this.tokenizer.printToken());

        this.tokenizer.advance();

        //wait for a function name
        if(!this.tokenizer.identifier())
        {
            return false;
        }

        this.writeXML(this.tokenizer.printToken());

        this.tokenizer.advance();

        //check parameter list
        //this.compileList();

        //await )
        if(this.tokenizer.symbol() != "(")
        {
            return false;
        }

        this.writeXML(this.tokenizer.printToken());

        this.tokenizer.advance();

        //wait for parameter list
        this.writeXML("<parameterList>");
        this.compileExpressionList()//CHECAR AQUI
        this.writeXML("</parameterList>")

        if(this.tokenizer.symbol() != ")")
        {
            return false;
        }

        this.writeXML(this.tokenizer.printToken());

        this.writeXML("<subroutineBody>")

        this.tokenizer.advance();

        if(this.tokenizer.symbol() != "{")
        {
            return false;
        }

        this.writeXML(this.tokenizer.printToken());

        //wait for var declaration
        this.tokenizer.advance();
        while(
            this.tokenizer.keyWord() == "var"
        ){
            this.compileVarDec();
        }

        //wait statments 
        while(
            ["let", "if", "while", "do", "return"].includes(this.tokenizer.keyWord())
        ){
            this.compileStatments();
        }

        //wait for } to end subroutine
        if(this.tokenizer.symbol() != "}")
        {
            return false;
        }

        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();

        this.writeXML("</subroutineBody");
        this.writeXML("</subroutineDec>");

    }

    compileParameterList()
    {
        console.log('entered compileParameterList');

        if(!["void", "int", "char", "boolean"].includes(this.tokenizer.keyWord()) && !this.tokenizer.identifier()){
            return false;
        }   

        this.writeXML(this.tokenizer.printToken());

        this.tokenizer.advance();

        //wait for var name
        if(!this.tokenizer.identifier())
        {
            return false;
        }  

        this.writeXML(this.tokenizer.printToken());

        this.tokenizer.advance();

        while(
            this.tokenizer.symbol() == ","
        ){
            this.tokenizer.advance()

            if(!["int", "char", "boolean"].includes(this.tokenizer.keyWord()) && !this.tokenizer.identifier()){
                return false;
            }

            this.writeXML(this.tokenizer.printToken());

            this.tokenizer.advance();
            //wait for var name
            if(!this.tokenizer.identifier())
            {
                return false;
            }

            this.writeXML(this.tokenizer.printToken());

            this.tokenizer.advance();

        }
    }


    compileVarDec()
    {
        console.log('entered compileVarDec');

        this.writeXML("<varDec>")

        //wait for a var declaration
        if(this.tokenizer.keyWord() != "var"){
            return false;
        }  

        this.writeXML(this.tokenizer.printToken());

        this.tokenizer.advance();

        //expected a var type
        if(!["int", "char", "boolean"].includes(this.tokenizer.keyWord()) && !this.tokenizer.identifier())
        {
            return false;
        }

        this.writeXML(this.tokenizer.printToken());

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
            this.writeXML(this.tokenizer.printToken());

            this.tokenizer.advance();

            if(!this.tokenizer.identifier())
            {
                return false;
            }

            this.writeXML(this.tokenizer.printToken());

            this.tokenizer.advance();
        }

        if(this.tokenizer.symbol() != ";")
        {
            return false;
        }

        this.writeXML(this.tokenizer.printToken());

        this.tokenizer.advance();

        this.writeXML("</varDec>")

    }

    compileStatments()
    {
        console.log('entered compileStatement');

        'wait for a sequence of statements, not includind {}'
        this.writeXML("<statements>");
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

        this.writeXML("</statements>")
    }

    compileDo()
    {
        console.log('entered compileDo');

        this.writeXML("<doStatement>")
        if(this.tokenizer.keyWord() != "do"){
            return false;
        }

        this.writeXML(this.tokenizer.printToken());

        this.tokenizer.advance();

        //wait subroutine
        this.compileSubtoutine();

        //wait for ;
        if(this.tokenizer.symbol() != ";")
        {
            return false;
        }

        this.writeXML(this.tokenizer.printToken());

        this.tokenizer.advance();

        this.writeXML("</doStatement>")

    }


    compileLet()
    {
        console.log('entered compileLet');

        //wait for a let statement
        this.writeXML("<letStatement>")
        if(this.tokenizer.keyWord() != "let")
        {
            return false;
        }

        this.writeXML(this.tokenizer.printToken());

        this.tokenizer.advance();

        if(!this.tokenizer.identifier())
        {
            return false;
        }

        this.writeXML(this.tokenizer.printToken());

        this.tokenizer.advance();

        if(this.tokenizer.symbol() == "[")
        {
            this.writeXML(this.tokenizer.printToken());

            this.tokenizer.advance();
            this.compileExpression();

            if(this.tokenizer.symbol() != "]"){
                return false;
            }

            this.writeXML(this.tokenizer.printToken());

            this.tokenizer.advance();            

        }

        //wait for =
        if(this.tokenizer.symbol() != "=")
        {
            return false;
        }

        this.writeXML(this.tokenizer.printToken());

        this.tokenizer.advance();

        this.compileExpression();

        if(this.tokenizer.symbol() != ";")
        {
            return false;
        }

        this.writeXML(this.tokenizer.printToken());

        this.tokenizer.advance();

        this.writeXML("</letStatement>");

    }

    compileWhile()
    {
        console.log('entered compileWhile');

        this.writeXML("whileStatement>")

        //compile wait statement
        if(this.tokenizer.keyWord() != 'while')
        {
            return false;
        }    
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        //wait for a (
        if(this.tokenizer.symbol() != "(")
        {   
            return false;
        }

        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();

        this.compileExpression();

        //wait for a )
        if(this.tokenizer.symbol() != ")")
        {
            return false;
        }

        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();

        //wait for a {
        if(this.tokenizer.symbol() != "{"){
            return false;
        }

        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        this.compileStatments();

        //wait for a }
        if(this.tokenizer.symbol() != "}")
        {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        this.writeXML("</whileStatement>")
    }

    compileReturn()
    {
        console.log('entered compileReturn');
        this.writeXML("<returnStatement>")
       if(this.tokenizer.keyWord() != "return")
       {
           return false;
       } 

       this.writeXML(this.tokenizer.printToken());
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

       this.writeXML(this.tokenizer.printToken());
       this.tokenizer.advance();
       this.writeXML("</returnStatement")
    }


    compileIf()
    {
        console.log('entered compileIf');
        this.writeXML("<ifStatement>")
        if(this.tokenizer.keyWord() != "if")
        {
            return false;
        }

        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();

        //wait for a (
        if(this.tokenizer.symbol() != "(")
        {
            return false;
        }

        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        this.compileExpression()

        //wait for )
        if(this.tokenizer.symbol() != ")")
        {
            return false;
        }

        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();

        //expect {
        if(this.tokenizer.symbol() != "{")
        {
            return false;
        }
        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
        this.compileStatments();

        //wait for a }
        if(this.tokenizer.symbol() != "}")
        {
            return false;
        }

        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();
    
        if(this.tokenizer.keyWord() == "else")
        {
            this.tokenizer.advance();
            this.compileStatments();

            if(this.tokenizer.symbol() != "}")
            {
                return false;
            }
            this.writeXML(this.tokenizer.printToken());
            this.tokenizer.advance();

        }

        this.writeXML("</ifStatement>")

    }

    compileExpression()
    {
        console.log('entered compileExpression');

        this.writeXML("<expression>")
        this.compileTerm();

        while
        (
            ["+", "-", "*", "/", "&", "|", "<", ">", "="].includes(this.tokenizer.symbol())
        )
        {
            this.writeXML(this.tokenizer.printToken());
            this.tokenizer.advance();
            this.compileTerm();
        }

        this.writeXML("</expression>")
    }

    compileTerm()
    {
        console.log('entered compileTerm');
        this.writeXML("<term>")
        let thisisterm:boolean = false;
        if(this.tokenizer.intVal())
        {
            thisisterm = true;
            this.writeXML(this.tokenizer.printToken());   
        }
        else if(this.tokenizer.stringVal())
        {
            thisisterm = true;   
            this.writeXML(this.tokenizer.printToken());
        }
        else if(this.tokenizer.keyWord())
        {
            const keyterm = this.tokenizer.keyWord();
            if(!["true", "false", "null", "this"].includes(keyterm))
            {
                return false;
            }

            thisisterm = true;
            this.writeXML(this.tokenizer.printToken());
        }
        else if(this.tokenizer.symbol() == "(")
        {
            this.writeXML(this.tokenizer.printToken());
            this.tokenizer.advance();
            this.compileExpression();

            if(this.tokenizer.symbol() != ")")
            {
                return false;
            }

            thisisterm = true;
            this.writeXML(this.tokenizer.printToken());   
        }
        else if(["-", "~"].includes(this.tokenizer.symbol()))
        {
            this.writeXML(this.tokenizer.printToken());
            this.tokenizer.advance();
            this.compileTerm();
        }

        else if(this.tokenizer.identifier())
        {
            this.writeXML(this.tokenizer.printToken());
            this.tokenizer.advance();
            if(this.tokenizer.symbol() == "[")
            {
                this.writeXML(this.tokenizer.printToken());
                this.tokenizer.advance();
                this.compileExpression();

                if(this.tokenizer.symbol() != "]")
                {
                    return false;
                }

                thisisterm = true;
                this.writeXML(this.tokenizer.printToken());

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
                this.writeXML(this.tokenizer.printToken());
            }
            else if(this.tokenizer.symbol() == ".")
            {
                this.writeXML(this.tokenizer.printToken());
                this.tokenizer.advance();
                if(!this.tokenizer.identifier())
                {
                    return false;
                }

                this.writeXML(this.tokenizer.printToken());
                this.tokenizer.advance();

                if(this.tokenizer.symbol() != "(")
                {
                    return false;
                }

                this.writeXML(this.tokenizer.printToken());
                this.tokenizer.advance();
                this.compileExpressionList();

                if(this.tokenizer.symbol() != ")")
                {
                    return false;
                }

                thisisterm = true;
                this.writeXML(this.tokenizer.printToken());
            }

        }

        if(thisisterm = true)
        {
            this.tokenizer.advance();
        }

        this.writeXML("</term>")

    }


    compileExpressionList()
    {
        console.log('entered compileExpressionList');
        this.writeXML("<expressionList>")
        this.compileExpression();

        while(this.tokenizer.symbol()== ",")
        {
            this.writeXML(this.tokenizer.printToken());
            this.tokenizer.advance();
            this.compileExpression();
        }
        
        this.writeXML("</expressionList>")
    }

    compileSubroutineCall()
    {

        console.log('entered compileSubroutineCall');

        if(!this.tokenizer.identifier())
        {
            return false;
        }

        this.writeXML(this.tokenizer.printToken());
        this.tokenizer.advance();

        if(this.tokenizer.symbol() == "(")
        {
            this.writeXML(this.tokenizer.printToken());
            this.tokenizer.advance();
            this.compileExpressionList();

            //wait for )
            if(this.tokenizer.symbol() != ")")
            {
                return false;
            }
            
            this.writeXML(this.tokenizer.printToken());

        }else if(this.tokenizer.symbol() == ".")
        {
            this.writeXML(this.tokenizer.printToken());

            this.tokenizer.advance();
            //wait a identifier for method name
            if(!this.tokenizer.identifier())
            {
                return false;
            }

            this.writeXML(this.tokenizer.printToken());

            this.tokenizer.advance();
            //wait for a (
            
            if(this.tokenizer.symbol() != "(")
            {
                return false;
            }

            this.writeXML(this.tokenizer.printToken());
            this.tokenizer.advance();
            this.compileExpressionList();

            if(this.tokenizer.symbol() != ")")
            {
                return false;
            }
            
            this.writeXML(this.tokenizer.printToken());

        }else
        {
            return false;
        }

        this.tokenizer.advance();
    }

    /*setXMLContent(expression:string)
    {
        this.XMLFile += expression;
    }*/

    writeXML(xmlContent:string)
    {
        console.log(xmlContent);
        /*fs.writeFile('compile.xml', xmlContent, (err)=>{
            console.log(err)
        })*/
    }
  

}