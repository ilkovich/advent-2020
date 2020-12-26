const assert = require("assert/strict");
const { isIPv4 } = require("net");

function compute(str) {
  return str.split(" ").reduce((val, curr) => {
    if (val.length < 2) {
      return [...val, curr];
    }

    return [eval([...val, curr].join(""))];
  }, [])[0];
}

function compute2(str) {
  let nextStr = str;
  do {
    str = nextStr;
    nextStr = str.replace(/(\d+) \+ (\d+)/, (match, p1, p2) => eval(match));
  } while (str !== nextStr);

  return eval(str);
}

function exec(str, fn) {
  let idxStart;
  while ((idxStart = str.lastIndexOf("(")) !== -1) {
    const idxEnd = str.indexOf(")", idxStart);
    const final = str.slice(idxStart + 1, idxEnd);
    str = str.slice(0, idxStart) + fn(final) + str.slice(idxEnd + 1);
  }

  return str.length > 1 ? fn(str) : parseInt(str);
}

const fs = require("fs");
const data = String(fs.readFileSync("./data.txt")).trim().split("\n");

/** part 1 */
console.log(data.reduce((sum, curr) => sum + exec(curr, compute), 0));

/** part 2 */
console.log(data.reduce((sum, curr) => sum + exec(curr, compute2), 0));
