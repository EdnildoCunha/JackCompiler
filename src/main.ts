import { AnalisadorSintatico }  from './analisador_sintatico';

//import { Tokenizer } from './app';

//new Tokenizer('Main.jack');

new AnalisadorSintatico('Main.jack');
////t.compileClass();

/*import * as fs from 'fs';

let indexLine:any = '';
fs.readFile('Main.jack', 'utf8', (err, data) => {
    if (err) throw err;
    console.log('data01');
    console.log(data);
    if(data.length != 0)
    {
        this.indexLine = data;
    }
    //this.token = "";
});

const readStream = fs.createReadStream('Main.jack', 'utf8');

readStream
.on('data', (chunk) => {
    //this.indexLine += chunk;
    console.log('chunk');
    console.log(chunk);
    return chunk;
}).on('end', () => {
    console.log('data02');
    //console.log(data);
});*/