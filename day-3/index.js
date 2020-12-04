const fs = require("fs");
const data = String(fs.readFileSync("./data.txt")).split("\n");

const line = data[0];

const isTree = (line, column) => line[column % line.length] === "#";

const measureSlope = (right, down) => {
  let treeCount = 0;
  for (
    let rowIndex = 0, colIndex = 0;
    rowIndex < data.length;
    rowIndex += down, colIndex += right
  ) {
    treeCount += isTree(data[rowIndex], colIndex) ? 1 : 0;
  }

  return treeCount;
};

console.log(
  [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
  ].reduce((acc, curr) => {
    return acc * measureSlope.apply(null, curr);
  }, 1)
);
