const fs = require("fs");

const results = [];
const eligible = [];

const data = String(fs.readFileSync("./data.txt"))
  .split("\n")
  .map((i) => parseInt(i));

const dataObj = data.reduce((acc, curr) => {
  acc[curr] = true;
  return acc;
}, {});

for (var i = 0; i < data.length; i++) {
  for (var j = i + 1; j < data.length; j++) {
    const sum = data[i] + data[j];
    const complement = 2020 - sum;
    if (dataObj[complement]) {
      console.log(data[i], data[j], complement);
      console.log(data[i] * data[j] * complement);
    }
  }
}
