"use strict";
exports.__esModule = true;
//import { AnalisadorSintatico }  from './analisador_sintatico';
var fs = require("fs");
//import { Tokenizer } from './app';
//new Tokenizer('Main.jack');
//new AnalisadorSintatico('Main.jack');
////t.compileClass();
function writeXMLT(xmlContent) {
    fs.writeFile('./compile.xml', xmlContent, function (err) {
        console.log(err);
    });
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
var teste = [
    'teste0',
    'teste1',
    'test02'
];
fs.writeFile('./compile.xml', '<tokenizer>', function (err) {
    console.log(err);
});
//contentXML+= '<tokenizer>';
for (var _i = 0, teste_1 = teste; _i < teste_1.length; _i++) {
    var token = teste_1[_i];
    //writeXMLT(token);   
    //contentXML += token;
    console.log(token);
    fs.writeFile('./compile.xml', token, function (err) {
        console.log(err);
    });
}
//contentXML+= '</tokenizer>';
//console.log(contentXML);
/*fs.writeFile('./compile.xml', '</tokenizer>', (err)=>{
    console.log(err)
})*/ 
