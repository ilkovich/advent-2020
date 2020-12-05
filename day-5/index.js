const fs = require("fs");
const data = String(fs.readFileSync("./data.txt")).split("\n");

class Plane {
  constructor() {
    this.grid = [...Array(128)].map((_, row) =>
      [...Array(8)].map((_, col) => new Seat(row, col))
    );
  }

  search(query, rowStart = 0, rowEnd = 127, colStart = 0, colEnd = 7) {
    if (query == "") {
      if (rowStart !== rowEnd) {
        console.log(rowStart, rowEnd, colStart, colEnd);
        throw new Error("could not determine row");
      }
      if (colStart !== colEnd) {
        console.log(rowStart, rowEnd, colStart, colEnd);
        throw new Error("could not determine col");
      }

      return this.grid[rowStart][colStart];
    }

    const char = query[0];
    const rest = query.slice(1);
    const maxRow = rowEnd - rowStart == 1;
    const maxCol = colEnd - colStart == 1;

    switch (char) {
      case "F":
        rowEnd = this.midpoint(rowStart, rowEnd, false);
        break;
      case "B":
        rowStart = this.midpoint(rowStart, rowEnd, true);
        break;
      case "R":
        colStart = this.midpoint(colStart, colEnd, true);
        break;
      case "L":
        colEnd = this.midpoint(colStart, colEnd, false);
        break;
      default:
        throw new Error("unknown character " + char);
    }

    return this.search(rest, rowStart, rowEnd, colStart, colEnd);
  }

  midpoint(min, max, roundUp) {
    return Math[roundUp ? "ceil" : "floor"](min + (max - min) / 2);
  }

  findEmpty() {
    const results = [];
    let foundFilled = false;
    let foundEmpty = false;
    this.grid.forEach((row) => {
      row.forEach((seat) => {
        if (seat.marked) {
          foundFilled = true;
        } else {
          foundEmpty = true;
          if (foundFilled == true) {
            results.push(seat);
          }
        }
      });
    });

    return results;
  }
}

class Seat {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.marked = false;
  }

  mark() {
    this.marked = true;
  }

  toString() {
    return this.marked ? "*" : ".";
  }

  getSeatID() {
    return this.row * 8 + this.col;
  }
}

function partOne() {
  plane = new Plane();
  const max = data.reduce((max, curr) => {
    const seatId = plane.search(curr).getSeatID();
    if (!seatId) {
      console.log("**", curr, seatId);
      throw new Error(`Invalid ${curr} ${seatId}`);
    }
    return Math.max(max, seatId);
  }, 0);

  console.log(max);
}

function partTwo() {
  plane = new Plane();
  data.forEach((query) => plane.search(query).mark());
  console.log(plane.findEmpty()[0].getSeatID());
}

partTwo();

// console.log(
//   plane.midpoint(0, 127),
//   plane.midpoint(0, 63, true),
//   plane.midpoint(32, 63),
//   plane.midpoint(32, 47, true),
//   plane.midpoint(40, 47, true),
//   plane.midpoint(44, 45, false),
//   plane.midpoint(44, 45, true)
// );
