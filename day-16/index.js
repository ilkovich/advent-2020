const __data = `
class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12
`
  .trim()
  .split("\n");

const _data = `
class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9
`
  .trim()
  .split("\n");

const fs = require("fs");
const data = String(fs.readFileSync("./data.txt")).trim().split("\n");

const parsed = data.reduce(
  (acc, curr) => {
    if (curr == "") {
      acc.order.shift();
    } else {
      acc[acc.order[0]].push(curr);
    }
    return acc;
  },
  {
    order: ["rules", "ticket", "nearby"],
    rules: [],
    ticket: [],
    nearby: [],
  }
);

//clean up
delete parsed.order;
parsed.ticket.shift();
parsed.nearby.shift();

parsed.ticket = parsed.ticket[0].split(",").map((v) => parseInt(v));

class Rule {
  constructor(strRule) {
    const [, title, values] = strRule.match(/(.+): (.+)$/);
    this.title = title;
    this.ranges = values
      .split(" or ")
      .map((curr) => curr.split("-").map((i) => parseInt(i)));
  }

  hasValidRange(value) {
    let valid = false;
    for (let j = 0; j < this.ranges.length && !valid; j++) {
      const [min, max] = this.ranges[j];
      valid = this.validForRange(value, min, max);
    }

    return valid;
  }

  validForAll(values) {
    let valid = true;
    for (let i = 0; i < values.length && valid; i++) {
      valid = this.hasValidRange(values[i]);
    }

    return valid;
  }

  validForAny(values) {
    let valid = false;
    for (let i = 0; i < values.length && !valid; i++) {
      for (let j = 0; j < this.ranges.length; j++) {
        const [min, max] = this.ranges[j];
        valid = this.validForRange(values[i], min, max);
        if (valid) break;
      }
    }

    return valid;
  }

  validForRange(value, min, max) {
    return value >= min && value <= max;
  }
}

parsed.rules = parsed.rules.map((rule) => new Rule(rule));
parsed.nearby = parsed.nearby.map((nearby) =>
  nearby.split(",").map((val) => parseInt(val))
);

const badOnes = parsed.nearby
  .reduce((acc, curr) => acc.concat(curr), [])
  .filter((value) => {
    for (let i = 0; i < parsed.rules.length; i++) {
      if (parsed.rules[i].validForAny([value])) return false;
    }

    return true;
  });

console.log(
  "bad sum",
  badOnes.reduce((sum, curr) => sum + curr, 0)
);

parsed.nearby = parsed.nearby.filter(
  (ticket) => ticket.filter((val) => badOnes.indexOf(val) >= 0).length === 0
);

parsed.nearbyTransposed = parsed.nearby[0].map((_, idx) => {
  return parsed.nearby.map((nearbyArr) => nearbyArr[idx]);
});

const eligible = parsed.nearbyTransposed.reduce((acc, values, idx) => {
  parsed.rules.forEach((rule) => {
    if (rule.validForAll(values)) {
      acc[rule.title] = acc[rule.title] || [];
      acc[rule.title].push(idx);
    }
  });
  return acc;
}, {});

const map = Object.keys(eligible)
  .sort((keyA, keyB) => {
    return eligible[keyA].length - eligible[keyB].length;
  })
  .reduce((acc, key) => {
    const poss = eligible[key].filter((x) => !Object.values(acc).includes(x));
    if (poss.length > 1) throw new Error(key + " " + poss[0]);
    acc[key] = poss[0];
    return acc;
  }, {});

console.log(
  "--->",
  Object.keys(map)
    .filter((k) => k.match(/^departure/))
    .reduce((prd, key) => prd * parsed.ticket[map[key]], 1)
);
