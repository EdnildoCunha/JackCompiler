enum KIND{
    STATIC = "static",
    FIELD = "field",
    ARG = "argument",
    VAR = "local",
    NONE = "none"
}

interface VarCount{
    STATIC:number,
    FIELD:number,
    ARG:number,
    VAR:number,
    NONE:number
}


class SymbolTable{

    varCount: VarCount = {
        ARG: 0,
        FIELD: 0,
        NONE: 0,
        STATIC: 0,
        VAR: 0
    }

    startSubroutineScope:any[] = []; 

    define(name:string, type:string, kind:KIND)
    {

            if(KIND.ARG){
                const obj = {
                    name: name,
                    type: type,
                    kind: kind,
                    index: this.varCount.ARG
                }
                this.startSubroutineScope.push(obj);
                this.varCount.ARG+=1;
            }
            else if(KIND.VAR){
                const obj = {
                    name: name,
                    type: type,
                    kind: kind,
                    index: this.varCount.VAR
                }
                this.varCount.VAR += 1;
                this.startSubroutineScope.push(obj);
            }
            else if(KIND.STATIC){
                const obj = {
                    name: name,
                    type: type,
                    kind: kind,
                    index: this.varCount.STATIC
                }
                this.varCount.STATIC += 1;
                this.startSubroutineScope.push(obj);
            }else if(KIND.FIELD){
                const obj= {
                    name: name,    
                    type: type,
                    kind: kind,
                    index: this.varCount.FIELD
                }
                this.varCount.FIELD += 1;
                this.startSubroutineScope.push(obj);
            }        
    }

    
    kindOf(name:string):KIND
    {
        const identifier = this.startSubroutineScope.find((element)=>{
            return element['name'] == name;
        })

        if(identifier){
            return identifier['kind'];
        }

        return KIND.NONE;
    }

    typedOf(name:string)
    {
        const identifier = this.startSubroutineScope.find((element)=>{
            return element['name'] == name;
        })

        if(identifier){
            return identifier['type'];
        }

        return KIND.NONE;
    }

    indexOf(name:string):number{
        const index = this.startSubroutineScope.findIndex((element)=>{
            return element['name'] == name;
        })

        return index;
    }

}
