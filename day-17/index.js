const _data = `
.#.
..#
###
`.trim();

const data = `
..#....#
##.#..##
.###....
#....#.#
#.######
##.#....
#.......
.#......
`.trim();

const OFFSETS_PART_ONE = [
  [0, 0, 1],
  [0, 0, -1],
  [0, 1, 0],
  [0, 1, 1],
  [0, 1, -1],
  [0, -1, 0],
  [0, -1, 1],
  [0, -1, -1],
  [1, 0, 0],
  [1, 0, 1],
  [1, 0, -1],
  [1, 1, 0],
  [1, 1, 1],
  [1, 1, -1],
  [1, -1, 0],
  [1, -1, 1],
  [1, -1, -1],
  [-1, 0, 0],
  [-1, 0, 1],
  [-1, 0, -1],
  [-1, 1, 0],
  [-1, 1, 1],
  [-1, 1, -1],
  [-1, -1, 0],
  [-1, -1, 1],
  [-1, -1, -1],
];

const OPTIONS = [0, 1, -1];
const OFFSETS = [];
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    for (let k = 0; k < 3; k++) {
      for (let l = 0; l < 3; l++) {
        if (i + j + k + l !== 0)
          OFFSETS.push([OPTIONS[i], OPTIONS[j], OPTIONS[k], OPTIONS[l]]);
      }
    }
  }
}

class Grid {
  constructor(data = "") {
    this.cubes = {};
    data.split("\n").forEach((row, y) => {
      row
        .split("")
        .forEach((cube, x) => this.setCubeAt(x, y, 0, 0, cube == "#"));
    });
  }

  getCubeAt(x, y, z, w) {
    return this.cubes[`${x}.${y}.${z}.${w}`];
  }

  setCubeAt(x, y, z, w, active = false) {
    return (this.cubes[`${x}.${y}.${z}.${w}`] = new Cube(
      x,
      y,
      z,
      w,
      active,
      this
    ));
  }

  getNeighbors(cube) {
    return OFFSETS.map((offset) => {
      const [x, y, z, w] = [
        offset[0] + cube.x,
        offset[1] + cube.y,
        offset[2] + cube.z,
        offset[3] + cube.w,
      ];
      return this.getCubeAt(x, y, z, w) || this.setCubeAt(x, y, z, w);
    });
  }

  expand() {
    Object.values(this.cubes).forEach((cube) => cube.getNeighbors());
  }

  cycle() {
    this.expand();
    return Object.values(this.cubes).reduce((newGrid, cube) => {
      const neighborStates = cube.getNeighbors().map((cube) => cube.active);
      const activeCount = neighborStates.filter((state) => state).length;

      const nextActive =
        (cube.active && [2, 3].includes(activeCount)) ||
        (!cube.active && activeCount == 3);

      newGrid.setCubeAt(cube.x, cube.y, cube.z, cube.w, nextActive);

      return newGrid;
    }, new Grid());
  }

  activeCount() {
    return Object.values(this.cubes).filter((cube) => cube.active).length;
  }
}

class Cube {
  constructor(x, y, z, w, active, grid) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    this.active = active;
    this.grid = grid;
  }

  getNeighbors() {
    return this.grid.getNeighbors(this);
  }
}

let grid = new Grid(data);

for (let i = 0; i <= 6; i++, grid = grid.cycle()) {
  console.log(grid.activeCount());
}
