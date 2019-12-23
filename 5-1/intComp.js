const fs = require('fs')
const { promisify } = require('util')

const readFileAsync = promisify(fs.readFile)

class Program {
    constructor(initialMemoryState) {
        this.memoryState = initialMemoryState;
    }

    performOperation() {
        let index = 0;
        let opCode = this.memoryState[index];
        while (opCode != 99) {
            let arg1Index = this.memoryState[index+1];
            let arg2Index = this.memoryState[index+2];
            let arg1 = this.memoryState[arg1Index];
            let arg2 = this.memoryState[arg2Index];
            let saveIndex = this.memoryState[index+3];
            let calc = 0;
            switch (opCode) {
                case 1: 
                    calc = arg1 + arg2 ;
                    break;
                case 2: 
                    calc = arg1 * arg2 ;
                    break;
                case 3:
                    this.memoryState[arg1] = arg2;
                    break;
                case 4:
                    return this.memoryState[arg1];
                case 99:
                    return;
            }
            this.memoryState[saveIndex] = calc;
            index +=4;
            opCode = this.memoryState[index];
        }    
    }    
}

const run = async () => {
    let inputs = await readFileAsync('./2-2/input.txt', 'utf8');
    let initialInput = inputs.split(',').map(s => Number.parseInt(s)).slice();
    let program = new Program(initialInput);
    program.performOperation();


}

run()