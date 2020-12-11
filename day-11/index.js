const fs = require("fs");
let data = String(fs.readFileSync("./data.txt")).trim().split("\n");

const DIRECTION_OFFSETS = [
  [0, 1], // S
  [0, -1], // N
  [1, 0], // E
  [-1, 0], // W
  [1, 1], // SE
  [1, -1], // NE
  [-1, 1], // SW
  [-1, -1], // NW
];

class Seat {
  constructor(rowIdx, colIdx, state, map) {
    this.map = map;
    this.rowIdx = rowIdx;
    this.colIdx = colIdx;
    this.state = state;
  }

  toString() {
    return this.state;
  }

  getNext(adjacentSeats, nextMap) {
    const counts = adjacentSeats.reduce(
      (acc, curr) => {
        switch (curr.state) {
          case "#":
            acc.occupied = acc.occupied + 1;
            break;
          case "L":
            acc.empty = acc.empty + 1;
            break;
          default:
            break;
        }

        return acc;
      },
      { empty: 0, occupied: 0 }
    );

    let nextState = this.state;
    switch (this.state) {
      case "L":
        nextState = counts.occupied == 0 ? "#" : nextState;
        break;
      case "#":
        // nextState = counts.occupied >= 4 ? "L" : nextState;
        nextState = counts.occupied >= 5 ? "L" : nextState;
        break;
    }

    return new Seat(this.rowIdx, this.colIdx, nextState, nextMap);
  }
}

class SeatMap {
  constructor(rows) {
    if (rows)
      this.seats = rows.map((row, rowIdx) =>
        row
          .split("")
          .map((state, colIdx) => new Seat(rowIdx, colIdx, state, this))
      );
  }

  toString() {
    return this.seats
      .map((row) => row.map((seat) => seat.toString()).join(""))
      .join("\n");
  }

  step() {
    this.nextMap = new SeatMap();
    this.nextMap.seats = this.seats.map((row) =>
      row.map((seat) => seat.getNext(this.getAdjacentSeats(seat), this.nextMap))
    );

    return this.nextMap;
  }

  getAdjacentSeats(seat) {
    return DIRECTION_OFFSETS.reduce((acc, offset) => {
      let colIdx,
        rowIdx,
        row,
        nextSeat = seat;
      while (true) {
        colIdx = nextSeat.colIdx + offset[0];
        rowIdx = nextSeat.rowIdx + offset[1];

        row = this.seats[rowIdx];
        nextSeat = row && row[colIdx];
        if (!nextSeat) break;

        if (nextSeat && nextSeat.state !== ".") {
          acc.push(nextSeat);
          break;
        }
      }

      return acc;
    }, []);
  }

  getAdjacentSeatsPartOne(seat) {
    return DIRECTION_OFFSETS.reduce((acc, offset) => {
      const colIdx = seat.colIdx + offset[0];
      const rowIdx = seat.rowIdx + offset[1];

      if (colIdx >= 0 && rowIdx >= 0) {
        const row = this.seats[rowIdx];
        const seat = row && row[colIdx];
        if (seat) acc.push(seat);
      }

      return acc;
    }, []);
  }
}

// data = `
// L.LL.LL.LL
// LLLLLLL.LL
// L.L.L..L..
// LLLL.LL.LL
// L.LL.LL.LL
// L.LLLLL.LL
// ..L.L.....
// LLLLLLLLLL
// L.LLLLLL.L
// L.LLLLL.LL
// `
//   .trim()
//   .split("\n");

let map = new SeatMap(data);
nextMap = map.step();
while (map.toString() !== nextMap.toString()) {
  map = nextMap;
  nextMap = map.step();
  console.log(nextMap.toString() + "\n");
}

console.log(map.toString().match(/#/g).length);
