"use strict";
const fs = require('fs')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)

class WireGrid {
    constructor()
    {
        this.coord = {
            x: 0,
            y: 0
        };
        
        this.grid = [[]];
        this.grid[0][0] = 0;
        this.topX = 0;
        this.topY = 0;
    }

    setTopCoords(){
        if (this.coord.x > this.topX) this.topX = this.coord.x;
        if (this.coord.y > this.topY) this.topY = this.coord.y;
    }
    followInstructions(instructions){
        instructions.forEach( i => this.followInstruction(i));
    }
    followInstruction(instruction){
        let moveCounter = 0;
        while (moveCounter < instruction.distance)
        {
            this.move(instruction);
            moveCounter++;
            if (this.grid[this.coord.x] == undefined)
                this.grid[this.coord.x] = [];
            this.setTopCoords();
            this.grid[this.coord.x][this.coord.y] = 1;
        }
        if (this.coord.x < 0) throw("x went neg");
        if (this.coord.y < 0) throw("y went neg");
    }
    move(instruction) {
        switch (instruction.direction) {
            case "L":
                this.coord.x--;
                break;
            case "R":
                this.coord.x++;
                break;
            case "U":
                this.coord.y++;
                break;
            case "D":
                this.coord.y--;
                break;
        }
    }

    runInstructionsUntilCoord(matchCoord, instructions) {
        let totalMoveCounter = 0 ;
        let isDone = false;
        instructions.forEach( instruction => {
            if (isDone) return ;
            let moveCounter = 0;
            while (moveCounter < instruction.distance) {
                this.move(instruction);
                totalMoveCounter++;
                moveCounter++;
                if (matchCoord.x == this.coord.x && matchCoord.y == this.coord.y) {
                    isDone = true;
                    return totalMoveCounter;
                }
            }
        });
        return totalMoveCounter;
    }
}

const positiveQuadrantSpiral = function(coord)
{
    const RightSide = () => coord.x == coord.ring;
    const TopSide = () => coord.y == coord.ring;  
    const LayerFinish = () => coord.x == 0 && coord.y == coord.ring;
    if (coord.ring == 0){
        coord.ring++;
        coord.x = coord.ring;
    }
    else if (RightSide() && TopSide())
    {
        coord.x--
    }
    else if (RightSide()) {coord.y++}
    else if (LayerFinish()) {
        coord.ring++
        coord.x = coord.ring;
        coord.y = 0;
    }
    else if (TopSide()) {coord.x--;}
}

const FindGridCrosses = function(wireGrid1, wireGrid2) {
    let crossCoords = [];
    let coord = {x: 0, y: 0, ring:0};
    while(true) {
        let yRow1 = wireGrid1.grid[coord.x];
        let yRow2 = wireGrid2.grid[coord.x];
        if (yRow1 != undefined && yRow2 != undefined) {
            let p1 = yRow1[coord.y];
            let p2 = yRow2[coord.y];
            if (p1 == p2 && p1 == 1)
            {
                crossCoords.push({x: coord.x, y: coord.y});
            }
        }
        positiveQuadrantSpiral(coord);
        if (coord.x > wireGrid1.topX && coord.y < wireGrid1.topY)
            break;
    }
    return crossCoords;
}

const run = async () => {
    let input = await readFileAsync('./3-2/input.txt', 'utf8');
    let wireStrings = input.split('\n').map(i => i.split(','));

    let instructions = wireStrings.map(wireString =>
        wireString.map(ws => {
            let direction = ws[0];
            let distance =  Number.parseInt(ws.slice(1));
            return {"direction": direction, "distance": distance};
        })
    );
    let wireGrid1 = new WireGrid();
    let wireGrid2 = new WireGrid();
    let instructions1 = instructions[0];
    let instructions2 = instructions[1];
    wireGrid1.followInstructions(instructions1);
    wireGrid2.followInstructions(instructions2);

    let gridCrossCoordsArray = FindGridCrosses(wireGrid1, wireGrid2);

    gridCrossCoordsArray.forEach( gcc => {
        let wireGridForCalc1 = new WireGrid();
        let wireGridForCalc2 = new WireGrid();
        let dist1 = wireGridForCalc1.runInstructionsUntilCoord(gcc, instructions1);
        let dist2 = wireGridForCalc2.runInstructionsUntilCoord(gcc, instructions2);
        // console.log(dist1 + dist2);
    });
}
run()