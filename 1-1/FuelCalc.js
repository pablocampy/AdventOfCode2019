const fs = require('fs')
const { promisify } = require('util')

const readFileAsync = promisify(fs.readFile)

const run = async () => {
    var allMasses
    allMasses = await readFileAsync('./1-1/inputs.txt', 'utf8')
    // console.log(allMasses)
    var massArray = allMasses.split('\n');
    var changedArray = massArray.map( m => Math.floor(m/3) - 2);
    var total = 0;
    changedArray.forEach(m => total += m);
    console.log(total);
}

run()

// var blah;
// fs.readFile('.\\1-1\\inputs.txt', "utf8", function(err, blah)
// {
//     console.log("piss")
// });
// console.log(blah);

// var blah = fs.readFileSync('.\\1-1\\inputs.txt', "utf8");
// console.log(blah);