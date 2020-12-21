class Bus {
  constructor(id, idx) {
    this.id = id;
    this.idx = idx;
  }

  getNextDeparture() {
    const remainder = this.time % this.id;
    return this.time + (this.id - remainder);
  }

  isValid(time) {
    return (time + this.idx) % this.id === 0;
  }
}

const fs = require("fs");
const data = String(fs.readFileSync("./data.txt")).trim().split("\n");
const _data = `
939
7,13,x,x,59,x,31,19
`
  .trim()
  .split("\n");

// const TIME = parseInt(data[0]);
const ID = 0;

const busses = data[1].split(",").reduce((acc, id, idx) => {
  if (id !== "x") acc.push(new Bus(parseInt(id), idx));
  return acc;
}, []);

let t = busses[0].id;
busses.reduce((step, bus) => {
  for (let i = t; ; i += step) {
    if (bus.isValid(i)) {
      t = i;
      break;
    }
  }

  return step * bus.id;
}, 1);

console.log(t);
