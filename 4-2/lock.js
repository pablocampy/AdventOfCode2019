//It is a six-digit number.
const isSixDigit = function(number) {
    let numberString = String(number);
    return numberString.length == 6;
}

//The value is within the range given in your puzzle input.
const isInRange = function(number, lowRange, highRange) {
   return (number >= lowRange && number <= highRange)
}

//Two adjacent digits are the same (like 22 in 122345).
const adjacentDigitsSame = function (number){
    let numberString = number.toString();
    let digitsAsString = numberString.split("");
    for (let i=0; i<numberString.length-1; i++) {
        if (digitsAsString[i] == digitsAsString[i+1])
            return true;
    }
    return false;
}

//Part of larger matching group of digits
const threeOrMoreAdjacentDigits = function(number, digitToMatch) {
    let numberString = number.toString();
    let digitsAsString = numberString.split("");
    for (let i=0; i<numberString.length-1; i++) {
        if (digitToMatch == digitsAsString[i]
            && digitToMatch == digitsAsString[i+1]
            && digitToMatch == digitsAsString[i+2])
            return true;
    }
    return false;
}

const adjacentWithExtraElfRules = function(number)
{
    let numberString = number.toString();
    let digitsAsString = numberString.split("");
    for (let i=0; i<numberString.length-1; i++) {
        if (digitsAsString[i] == digitsAsString[i+1] && !threeOrMoreAdjacentDigits(number, digitsAsString[i]))
            return true;
    }
    return false;
    
}

//Going from left to right, the digits never decrease; they only ever increase or stay the same (like 111123 or 135679).
const digitsIncreaseLeftToRight = function (number){
    let numberString = number.toString();
    let digits = numberString.split("").map(s => Number(s));
    for (let i=0; i<numberString.length-1; i++) {
        if (digits[i] > digits[i+1])
            return false;
    }
    return true;
}

const matchAllRules = (number, lowRange, highRange) => isSixDigit(number) && isInRange(number, lowRange, highRange) && adjacentWithExtraElfRules(number) && digitsIncreaseLeftToRight(number);

const run = async () => {
    let min = 108457;
    let max = 562041;

    let testNumber = min;
    let numberCount = 0;
    for(testNumber; testNumber<=max; testNumber++) {
        if (matchAllRules(testNumber, min, max)) numberCount++;
    }
    console.log(numberCount);
}

run();