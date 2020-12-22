class Game {
  constructor(numbers) {
    this.turnMap = numbers.reduce((map, num, idx) => {
      map[num] = map[num] || [];
      map[num].unshift(idx + 1);
      this.lastNumber = num;
      this.turn = idx + 1;
      return map;
    }, new Array(30000000));
  }

  play() {
    this.turn += 1;
    const turns = this.turnMap[this.lastNumber];
    const nextNumber = turns.length === 1 ? 0 : turns[0] - turns[1];

    this.turnMap[nextNumber] = this.turnMap[nextNumber] || [];
    this.turnMap[nextNumber].unshift(this.turn);
    if (this.turnMap[nextNumber].length > 2)
      this.turnMap[nextNumber].length = 2;

    this.lastNumber = nextNumber;

    return this;
  }
}

const game = new Game([20, 9, 11, 0, 1, 2]);

while (game.turn !== 2020) {
  game.play();
}

console.log(game.turn, game.lastNumber);
