class Masker {
  constructor() {
    this.memory = {};
  }

  execute(line) {
    const maybeMask = line.match(/^mask = (.+)$/);

    if (maybeMask) {
      this.mask = maybeMask[1];
      return;
    }

    const [, address, strValue] = line.match(/^mem\[(\d+)\] = (\d+)$/);
    this.setFloatingAddress(parseInt(address), parseInt(strValue));
  }

  getSum() {
    return Object.values(this.memory)
      .filter((n) => typeof n === "number")
      .reduce((sum, n) => n + sum, 0);
  }

  set(idx, value) {
    const binary = value.toString(2).padStart(36, "0");
    this.memory[idx] = parseInt(
      this.mask
        .split("")
        .map((maskBit, idx) => this.result(binary[idx], maskBit))
        .join(""),
      2
    );
  }

  setFloatingAddress(address, value) {
    const binary = address.toString(2).padStart(36, "0");
    const indexes = this.mask.split("").reduce(
      (acc, maskBit, idx) => {
        const nextBits = this.resultAddress(binary[idx], maskBit);
        const result = [];
        nextBits.forEach((nextBit) => {
          acc.forEach((acc) => {
            result.push(acc + nextBit);
          });
        });
        return result;
      },
      [""]
    );

    indexes.forEach((index) => (this.memory[index] = value));
  }

  resultAddress(valueBit, maskBit) {
    if (maskBit === "X") return ["0", "1"];
    if (maskBit === "1") return ["1"];
    if (maskBit === "0") return [valueBit];
  }

  result(valueBit, maskBit) {
    if (maskBit === "X") return valueBit;
    if (maskBit === "1") return "1";
    if (maskBit === "0") return "0";

    throw new Error(`${valueBit} ${maskBit}`);
  }
}

const masker = new Masker();

const fs = require("fs");
const data = String(fs.readFileSync("./data.txt")).trim().split("\n");
const _data = `
mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1
`
  .trim()
  .split("\n");

data.forEach((line) => masker.execute(line));

console.log(masker.getSum());
