const NORTH = "N";
const EAST = "E";
const SOUTH = "S";
const WEST = "W";
const RIGHT = "R";
const LEFT = "L";
const FORWARD = "F";

const ORIENTATION = [NORTH, EAST, SOUTH, WEST];

class Ship {
  constructor(waypoint) {
    this.dir = EAST;
    this.position = [0, 0];
    this.waypoint = [10, 1];
  }

  execute(command) {
    let [, dir, strUnits] = command.match(/^(N|E|S|W|F|R|L)(\d+)$/) || [];
    if (!dir || !strUnits) throw new Error("Invlaid command " + command);

    const units = parseInt(strUnits);

    switch (dir) {
      case FORWARD:
        this.moveShip(units);
        break;
      case NORTH:
        this.moveWaypoint(0, units);
        break;
      case EAST:
        this.moveWaypoint(units, 0);
        break;
      case SOUTH:
        this.moveWaypoint(0, -1 * units);
        break;
      case WEST:
        this.moveWaypoint(-1 * units, 0);
        break;
      case RIGHT:
        this.rotate(units);
        break;
      case LEFT:
        this.rotate(360 - units);
        break;
      default:
        throw new Error("Invalid direction" + dir);
    }
  }

  rotate90(waypoint) {
    return [waypoint[1], -waypoint[0]];
  }

  rotate(units) {
    const diffIndex = units / 90;
    const currIndex = ORIENTATION.indexOf(this.dir);

    for (let i = 0; i < diffIndex; i++) {
      this.waypoint = this.rotate90(this.waypoint);
    }
  }

  moveWaypoint(x, y) {
    this.waypoint = [this.waypoint[0] + x, this.waypoint[1] + y];
  }

  moveShip(times) {
    this.position = [
      this.position[0] + this.waypoint[0] * times,
      this.position[1] + this.waypoint[1] * times,
    ];
  }

  getManhattanDistance() {
    return Math.abs(this.position[0]) + Math.abs(this.position[1]);
  }
}

const fs = require("fs");
const data = String(fs.readFileSync("./data.txt")).trim().split("\n");
const _data = `
F10
N3
F7
R90
F11
`
  .trim()
  .split("\n");

const ship = new Ship();
data.forEach((command) => ship.execute(command));
console.log(ship.getManhattanDistance());
