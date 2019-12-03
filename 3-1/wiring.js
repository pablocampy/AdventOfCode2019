const fs = require('fs')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)

let wireGridStarter = {
    coord: {
        x: 0,
        y: 0
    },
    grid: [[]]
}
wireGridStarter.grid[0][0] = 0;

const followInstruction = function(wireGrid, instruction)
{
    let moveCounter = 0;
    while (moveCounter < instruction.distance)
    {
        switch (instruction.direction)
        {
            case "L":
                wireGrid.coord.x--;
                break;
            case "R":
                wireGrid.coord.x++;
                break;
            case "U":
                wireGrid.coord.y++;
                break;
            case "D":
                wireGrid.coord.y--;
                break;
        }
        if (wireGrid.grid[wireGrid.coord.x] == undefined)
            wireGrid.grid[wireGrid.coord.x] = [];

        wireGrid.grid[wireGrid.coord.x][wireGrid.coord.y] = 1;
        moveCounter++;
    }
}

const calcDistance = (x, y) => Math.abs(x) + Math.abs(y);

const FindGridMatch = function(grid1, grid2)
{
    let x = 0;
    let y = 0;
    let shortDist = 9007199254740991;
    while(x < 10000000)
    {
        yRow1 = grid1[x];
        yRow2 = grid2[x];
        while(y < 1000000)
        {
            p1 = yRow1[y];
            p2 = yRow2[y];
            if (p1 == p2 && p1 == 1)
            {
                let dist = calcDistance(x,y);
                if (dist < shortDist)
                {
                    shortDist = dist;
                    break;
                }
            }
            y++;
            // if (calcDistance(x,y)>shortDist)
            //     break;
        }
        x++;
        // if (calcDistance(x,y)>shortDist)
        //     break;
    }
    return shortDist;
}

const run = async () => {
    // let input = await readFileAsync('./3-1/input.txt', 'utf8');
    let input = await readFileAsync('./3-1/test2.txt', 'utf8');
    let wireStrings = input.split('\n').map(i => i.split(','));

    let instructions = wireStrings.map(wireString =>
        wireString.map(ws => {
            let direction = ws[0];
            let distance =  Number.parseInt(ws.slice(1));
            return {"direction": direction, "distance": distance};
        })
    );
    let wireGrid1 = Object;
    let wireGrid2 = Object;
    Object.assign(wireGrid1, wireGridStarter);
    Object.assign(wireGrid2, wireGridStarter);
    let instruction1 = instructions[0];
    let instruction2 = instructions[1];
    instruction1.forEach( i => followInstruction(wireGrid1, i));
    instruction2.forEach( i => followInstruction(wireGrid2, i));

    let shortDist = FindGridMatch(wireGrid1.grid, wireGrid2.grid);
    console.log(shortDist);


    // followInstruction(wireGrid1, instructions[0][0]);

}

run()