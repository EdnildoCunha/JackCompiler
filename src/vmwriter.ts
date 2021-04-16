import * as fs from "fs"


enum Command{
    ADD = "add",
    SUB = "sub",
    NEG = "neg",
    EQ = "eq",
    GT = "gt",
    LT = "lt",
    AND = "and",
    OR = "or",
    NOT = "not",

}

enum Segment{
    CONST = "constant",
    ARG = "argument",
    LOCAL = "local",
    STATIC = "static",
    THIS = "this",
    THAT = "that",
    POINTER = "pointer",
    TEMP = "temp",
    
}

export class VMwriter{
    private OutputCommand:string = '';
    writePush(segment: Segment, index:number){
//escrever função
        this.OutputCommand = `push ${segment} ${index}`;

    }

    writePop(segment:Segment, index: number){
//escrever função
        this.OutputCommand = `pop ${segment} ${index}`;
    }

    writeArithmetic(command: Command){
        this.OutputCommand = `${command}`;
    
        
    }

    writeLabel(label: String){
        this.OutputCommand = `label ${label}`;

    }
    writeGOTO(label: String){
        this.OutputCommand = `goto ${label}`
        
    }

    writeIf(label: String){
        this.OutputCommand = `if-goto ${label}`

    }
    writeCall(name: String, nArgs: number){
        this.OutputCommand = `call ${name} ${nArgs}`

    }
    writeFunction(name: String, nLocals: number){
        this.OutputCommand = `function ${name} ${nLocals}`

    }
    writeReturn(){
        this.OutputCommand = 'return'

    }

    writeOutputFile(OutputCommand:string)
    {
        this.OutputCommand += OutputCommand;
    }

    writeVM(){
        fs.writeFile('Outputcode.vm', this.OutputCommand,(err)=>{
            console.log(err)
        })
    }
}