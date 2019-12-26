const fs = require('fs')
const { promisify } = require('util')

const readFileAsync = promisify(fs.readFile)

const parameterTypeEnum = Object.freeze({"position": 1, "immediate": 2});

class parameter {
    contructor(mode, value) {
        this.mode = mode;
        this.value = value;
    }
}

class instruction {
    constructor(fullInstruction) {
        let initialInput = fullInstruction.split(',').map(s => Number.parseInt(s)).slice();
        this.opAndParameterCodes = initialInput[0];
        this.parameter = this.readParameters(); 
        this.opCode = readOpCode();
    }

    readParameters() {
        let parCodes = this.opAndParameterCodes.slice(this.opAndParameterCodes.length - 2); //-2 from opCode in instruction
        let parameters = [];
        let parCodesCharArray = parCodes.split();
        let i = 0;
        while(i < parCodes.length) {
            let mode = String.parseInt(parCodesCharArray[parCodes.length - i]);
            let value = initialInput[i + 1]; // +1 from opAndParameterCodes
            parameters.push(new parameter(mode, value));
        }
    }

    readOpCode() {
        return this.opAndParameterCodes.slice(-2);
    }
}

class Program {
    constructor(initialMemoryState) {
        this.memoryState = initialMemoryState;
    }

    performOperation() {
        let index = 0;
        // let opCode = this.readOpCode(index);
        
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
    let 
    let program = new Program(initialInput);
    program.performOperation();


}

run()