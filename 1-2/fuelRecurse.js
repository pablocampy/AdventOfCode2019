const fs = require('fs')
const { promisify } = require('util')

const readFileAsync = promisify(fs.readFile)
const fuelForMass = (m) => Math.floor(m/3) - 2;
const recursiveFuel = (m) => 
{
    let newMass = fuelForMass(m);
    if (newMass > 0)
    {
        newMass += recursiveFuel(newMass);
        return newMass
    }
    return 0;
}

const run = async () => {
    var allMasses
    allMasses = await readFileAsync('./1-2/inputs.txt', 'utf8')
    var massArray = allMasses.split('\n');
    var changedArray = massArray.map(m => recursiveFuel(m));
    var total = 0;
    changedArray.forEach(m => total += m);
    console.log(total);
}


// let testMasses = ['12', '1969', '100756'];
// var changedArray = testMasses.map(m => recursiveFuel(m));
// console.log(changedArray);

run()