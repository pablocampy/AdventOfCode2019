const fs = require('fs')
const { promisify } = require('util')

const readFileAsync = promisify(fs.readFile)

const performOperation = function(array)
{
    let index = 0;
    let opCode = array[index];
    while (opCode != 99) {
        let arg1Index = array[index+1];
        let arg2Index = array[index+2];
        let arg1 = array[arg1Index];
        let arg2 = array[arg2Index];
        let saveIndex = array[index+3];
        let calc = 0;
        switch (opCode) {
            case 1: 
                calc = arg1 + arg2 ;
                break;
            case 2: 
                calc = arg1 * arg2 ;
                break;
            case 99:
                return array;
        }
        array[saveIndex] = calc;
        index +=4;
        opCode = array[index];
    }    
    return array;
}

const run = async () => {
    let index = 0;
    let inputs = await readFileAsync('./2-1/input.txt', 'utf8');
    let stringArray = inputs.split(',');
    let valueArray = stringArray.map(s => Number.parseInt(s));
    valueArray[1] = 12;
    valueArray[2] = 2;
    console.log(performOperation(valueArray)[0]);
}

run()