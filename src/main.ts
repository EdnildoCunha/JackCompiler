import { AnalisadorSintatico }  from './analisador_sintatico';
//import * as fs from "fs";


//import { Tokenizer } from './app';
//new Tokenizer('Main.jack');

new AnalisadorSintatico('./Main.jack');
////t.compileClass();

/*function writeXMLT(xmlContent:string){
        fs.writeFile('./compile.xml', xmlContent, (err)=>{
            console.log(err)
        })
}

let contentXML:any = '';

const teste:string[] = [
    `<token>test00</token>`,
    `<token>test01</token>`
] 

fs.writeFile('./compile.xml', '<tokenizer>', (err)=>{
    console.log(err)
})

contentXML+= '<tokenizer>';


for(let token of teste)
{
   console.log(token);   
   contentXML += token;
}


contentXML+= '</tokenizer>';
console.log(contentXML);


fs.writeFile('./compile.xml', contentXML, (err)=>{
    console.log(err)
})*/