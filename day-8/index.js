const fs = require("fs");
const { ppid } = require("process");
let data = String(fs.readFileSync("./data.txt")).trim();

// data = `
// nop +0
// acc +1
// jmp +4
// acc +3
// jmp -3
// acc -99
// acc +1
// jmp -4
// acc +6
// `.trim();

const DONE = "DONE";

class App {
  constructor(data) {
    this.instructions = data.map((line, idx) => new Operation(line, idx));
    this.subs = this.instructions.filter((i) => i.op.match(/jmp|nop/));
    this.lastSub = null;
  }

  init() {
    this.accumulator = 0;
    this.currLine = 0;
    this.executedLines = [];
  }

  iter() {
    this.init();
    if (this.lastSub) this.lastSub.toggle();

    this.lastSub = this.subs.shift();
    if (!this.lastSub) throw new Error("no more subs");
    this.lastSub.toggle();
  }

  step() {
    if (this.executedLines.indexOf(this.currLine) > -1) return false;

    if (this.currLine == this.instructions.length) {
      app.result = DONE;
      return false;
    }

    this.executedLines.push(this.currLine);
    const instruction = this.instructions[this.currLine];

    if (!instruction) throw new Error("Out of bounds");

    this.execute(instruction);
    return true;
  }

  execute(operation) {
    switch (operation.op) {
      case "nop":
        this.currLine += 1;
        break;
      case "acc":
        this.accumulator += operation.value;
        this.currLine += 1;
        break;
      case "jmp":
        this.currLine += operation.value;
        break;
      default:
        throw new Error("Invalid instruction");
    }
  }
}

class Operation {
  constructor(line, index) {
    const [op, value] = line.split(" ");
    this.op = op;
    this.value = parseInt(value, 10);
    this.index = index;
  }

  toggle() {
    switch (this.op) {
      case "jmp":
        this.op = "nop";
        break;
      case "nop":
        this.op = "jmp";
        break;
      default:
        throw new Error("can't toggle");
    }
  }
}

const app = new App(data.split("\n"));

do {
  app.iter();
  while (app.step());
} while (app.result != DONE);

console.log(app.accumulator);
