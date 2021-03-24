//import { AnalisadorSintatico }  from './analisador_sintatico';
import * as fs from "fs";


//import { Tokenizer } from './app';

//new Tokenizer('Main.jack');

//new AnalisadorSintatico('Main.jack');
////t.compileClass();

function writeXMLT(xmlContent:string){
        fs.writeFile('./compile.xml', xmlContent, (err)=>{
            console.log(err)
        })
}

//let contentXML:any = '';

/*fs.readFile('./compile.xml', 'utf8', (err, data)=>{
    if (err)
    {
        console.log(err);
        throw err;
    }
    console.log('xml file ', data);
})
*/
const teste:string[] = [
    'teste0',
    'teste1',
    'test02'
] 

fs.writeFile('./compile.xml', '<tokenizer>', (err)=>{
    console.log(err)
})

//contentXML+= '<tokenizer>';


for(let token of teste)
{
   //writeXMLT(token);   
   //contentXML += token;
   console.log(token)
   fs.writeFile('./compile.xml', token, (err)=>{
        console.log(err)
    })

}


//contentXML+= '</tokenizer>';
//console.log(contentXML);


/*fs.writeFile('./compile.xml', '</tokenizer>', (err)=>{
    console.log(err)
})*/