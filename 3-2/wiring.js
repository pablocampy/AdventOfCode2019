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
    }
    followInstruction(instruction){
        let moveCounter = 0;
        while (moveCounter < instruction.distance)
        {
            switch (instruction.direction)
            {
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
            if (this.grid[this.coord.x] == undefined)
                this.grid[this.coord.x] = [];
    
            this.grid[this.coord.x][this.coord.y] = 1;
            moveCounter++;
        }
    }
}

const moveSpiral = function(coord)
{
    const Center = coord.x == 0 && coord.y == 0;
    const RightSide = coord.x == coord.ring;
    const LeftSide = coord.x == -coord.ring;
    const TopSide = coord.y == coord.ring;
    const BottomSide = coord.y == -coord.ring;
    if (Center)
    {
        coord.x = 1;
        coord.y = 1;
        coord.ring = 1;
    }
    else if (RightSide) {
        if (TopSide) 
        {
            coord.ring++;
            coord.x++;
        }
        else if (BottomSide) 
            coord.x--;
        else
            coord.y--
    }
    else if (LeftSide) {
        if (TopSide) coord.x++;
        else if (BottomSide) coord.y++
        else coord.y++;
    }
    else if (TopSide) {
        coord.x++;
    }
    else if (BottomSide) {
        coord.x--;
    }
}

const FindGridCrosses = function(grid1, grid2)
{
    let crossCoords = [];
    let coords = {x: 0, y: 0, ring:0, move:"D"};
    while(true)
    {
        let yRow1 = grid1[coords.x];
        let yRow2 = grid2[coords.x];
        if (yRow1 == undefined || yRow2 == undefined)
            continue;
        let p1 = yRow1[coords.y];
        let p2 = yRow2[coords.y];
        if (p1 == p2 && p1 == 1)
        {
            crossCoords.push({x: coords.x, y: coords.y});
        }
        moveSpiral(coords);
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
    let instruction1 = instructions[0];
    let instruction2 = instructions[1];
    instruction1.forEach( i => wireGrid1.followInstruction(i));
    instruction2.forEach( i => wireGrid2.followInstruction(i));

    let gridCrossCoords = FindGridCrosses(wireGrid1.grid, wireGrid2.grid);
    console.log(gridCrossCoords[0]);
}
run()