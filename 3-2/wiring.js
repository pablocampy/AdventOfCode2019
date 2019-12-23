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
        
        this.gridPosXPosY = [[]];
        this.gridPosXPosY[0][0] = 0;
        this.gridPosXNegY = [[]];
        this.gridPosXNegY[0][0] = 0;
        this.gridNegXPosY = [[]];
        this.gridNegXPosY[0][0] = 0;
        this.gridNegXNegY = [[]];
        this.gridNegXNegY[0][0] = 0;
        this.topX = 0;
        this.topY = 0;
        this.bottomX = 0;
        this.bottomY = 0;
    }

    setGridPointTovalue(value) {
        if (this.coord.x >= 0) {
            if (this.coord.y >= 0) {
                if (this.gridPosXPosY[this.coord.x] == undefined) this.gridPosXPosY[this.coord.x] = [];
                this.gridPosXPosY[this.coord.x][this.coord.y] = value;
            }
            else if (this.coord.y < 0) {
                if (this.gridPosXNegY[this.coord.x] == undefined) this.gridPosXNegY[this.coord.x] = [];
                this.gridPosXNegY[this.coord.x][-this.coord.y] = value;
            }
        }
        if (this.coord.x < 0) {
            if (this.coord.y >= 0) {
                if (this.gridNegXPosY[-this.coord.x] == undefined) this.gridNegXPosY[-this.coord.x] = [];
                this.gridNegXPosY[-this.coord.x][this.coord.y] = value;
            }
            else if (this.coord.y < 0) {
                if (this.gridNegXNegY[-this.coord.x] == undefined) this.gridNegXNegY[-this.coord.x] = [];
                this.gridNegXNegY[-this.coord.x][-this.coord.y] = value;
            }
        }
        this.setTopOrBottomCoords();
    }

    GetValueAtPoint(x, y)
    {
        if (x >= 0) {
            if (y >= 0) {
                if (this.gridPosXPosY[x] == undefined) return undefined;;
                return this.gridPosXPosY[x][y];
            }
            else if (y < 0) {
                if (this.gridPosXNegY[x] == undefined) return undefined;
                return this.gridPosXNegY[x][-y] ;
            }
        }
        if (x < 0) {
            if (y >= 0) {
                if (this.gridNegXPosY[-x] == undefined) return undefined;
                return this.gridNegXPosY[-x][y];
            }
            else if (y < 0) {
                if (this.gridNegXNegY[-x] == undefined) return undefined;
                return this.gridNegXNegY[-x][-y];
            }
        }
    }

    setTopOrBottomCoords(){
        if (this.coord.x > this.topX) this.topX = this.coord.x;
        if (this.coord.y > this.topY) this.topY = this.coord.y;
        if (this.coord.x < this.bottomX) this.bottomX = this.coord.x;
        if (this.coord.y < this.bottomY) this.bottomY = this.coord.y;
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
            this.setGridPointTovalue(1);
        }
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

    distanceCoveredByInstructionUntilCoord(matchCoord, instructions) {
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

const moveCoord = function(coord, minX, maxX){
    if (coord.x >= maxX) {
        coord.x = minX;
        coord.y++
    }
    else {coord.x++;}
}

const FindGridCrosses = function(wireGrid1, wireGrid2) {
    let crossCoords = [];
    let coord = {x: wireGrid1.bottomX, y: wireGrid1.bottomY};
    while(true) {
        let p1 = wireGrid1.GetValueAtPoint(coord.x, coord.y);
        let p2 = wireGrid2.GetValueAtPoint(coord.x, coord.y);
        if (p1 == p2 && p1 == 1)
        {
            crossCoords.push({x: coord.x, y: coord.y});
        }
        moveCoord(coord, wireGrid1.bottomX, wireGrid1.topX);
        if (coord.x >= wireGrid1.topX && coord.y >= wireGrid1.topY)
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

    let lowest = Number.MAX_SAFE_INTEGER;
    gridCrossCoordsArray.forEach( gcc => {
        let wireGridForCalc1 = new WireGrid();
        let wireGridForCalc2 = new WireGrid();
        let dist1 = wireGridForCalc1.distanceCoveredByInstructionUntilCoord(gcc, instructions1);
        let dist2 = wireGridForCalc2.distanceCoveredByInstructionUntilCoord(gcc, instructions2);
        let combinedDist = dist1 + dist2 ;
        if (combinedDist < lowest)
            lowest = combinedDist;
    });
    console.log(lowest);
}
run()