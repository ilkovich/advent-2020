const fs = require("fs");
let data = String(fs.readFileSync("./data.txt"));

class Group {
  constructor() {
    this.set = {};
    this.members = 0;
  }

  append(line) {
    this.members++;
    line.split("").forEach((char) => {
      this.set[char] = this.set[char] ? this.set[char] + 1 : 1;
    });
  }

  countAnyYes() {
    return Object.keys(this.set).length;
  }

  countAllYes() {
    return Object.keys(this.set).filter((key) => this.set[key] == this.members)
      .length;
  }
}

const groups = data
  .trim()
  .split("\n")
  .reduce(
    (groups, curr) => {
      if (curr.trim() === "") {
        group = new Group();
        groups.push(group);
      } else {
        groups[groups.length - 1].append(curr);
      }

      return groups;
    },
    [new Group()]
  );

const sum = groups.reduce((acc, curr) => acc + curr.countAllYes(), 0);

console.log(sum);
