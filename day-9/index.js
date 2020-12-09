const fs = require("fs");
const { exit } = require("process");
let data = String(fs.readFileSync("./data.txt")).trim();

// data = `
// 35
// 20
// 15
// 25
// 47
// 40
// 62
// 55
// 65
// 95
// 102
// 117
// 150
// 182
// 127
// 219
// 299
// 277
// 309
// 576
// `.trim();

class Summer {
  constructor(preambleLength) {
    this.preambleLength = preambleLength;
    this.values = [];
  }

  tryAdd(value) {
    if (this.values.length < this.preambleLength) {
      this.values.push(value);
      return true;
    }

    if (this.isValid(value)) {
      this.values.shift();
      this.values.push(value);
      return true;
    }

    return false;
  }

  isValid(value) {
    const considered = [...this.values];
    const sums = considered.reduce((acc, curr, idx) => {
      considered.slice(idx + 1).forEach((next) => {
        if (next != curr) {
          acc.push(next + curr);
        }
      });
      return acc;
    }, []);

    return sums.indexOf(value) > -1;
  }
}

const summer = new Summer(25);

function partOne() {
  data.split("\n").forEach((value) => {
    value = parseInt(value);
    if (!summer.tryAdd(value)) {
      console.log(value);
      throw new Error();
    }
  });
}

data = data.split("\n").map((i) => parseInt(i));

let currSum, number, found, values;
function reset() {
  currSum = 0;
  number = 138879426;
  found = false;
  values = [];
}

for (let i = 0; i < data.length && !found; i++) {
  reset();
  values.push(data[i]);
  for (let j = i + 1; j < data.length; j++) {
    values.push(data[j]);
    currSum = values.reduce((acc, num) => acc + num, 0);
    if (currSum > number) {
      break;
    }

    if (currSum == number) {
      console.log("found!", currSum);
      const sortedValues = values.sort((a, b) => a - b);
      console.log(sortedValues);
      console.log(sortedValues[0] + sortedValues[sortedValues.length - 1]);
      found = true;
      break;
    }
  }
}
