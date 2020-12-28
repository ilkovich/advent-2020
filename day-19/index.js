const assert = require("assert/strict");

class RuleCollection {
  constructor() {
    this.rules = [];
  }

  parseRule(expr) {
    return expr.match(/^(\d+): (("\w+")|(.+))$/);
  }

  addRule(expr) {
    const [_, _idx, rule] = this.parseRule(expr);
    const idx = parseInt(_idx);
    if (idx === NaN) throw new Error(expr);

    this.rules[idx] = rule;
  }

  compileRule(rule, maxIters) {
    if (!rule || rule[0] === '"') return rule;

    let nextRule = rule;
    let iters = 0;
    do {
      rule = nextRule;
      nextRule = rule.replace(/(\d+)/g, (m) => {
        const num = parseInt(m);

        if (!this.rules[num]) throw new Error(`${num}`);
        return this.rules[num][0] === '"'
          ? eval(this.rules[num])
          : "(" + this.rules[num] + ")";
      });
    } while (rule !== nextRule && iters++ < maxIters);

    return rule.replace(/\s+|\d+/g, "");
  }

  compile(maxIters = Infinity) {
    this.rules_fixed = this.rules.map((rule) =>
      this.compileRule(rule, maxIters)
    );

    this.regexes = this.rules_fixed.map((rule) => {
      if (!rule) return rule;
      const literal = rule[0] === '"' ? eval(rule) : rule;
      return new RegExp("^" + literal + "$");
    });
  }
}

const fs = require("fs");
const data = String(fs.readFileSync("./data.txt")).trim();
const [rules, messages] = data.split("\n\n");

function partOne() {
  const rc = new RuleCollection();
  rules.split("\n").forEach((rule) => rc.addRule(rule));
  rc.compile();

  return messages.split("\n").filter((msg) => {
    return msg.match(rc.regexes[0]);
  }).length;
}

console.log(partOne());

//part 2
const rc = new RuleCollection();
rules.split("\n").forEach((rule) => rc.addRule(rule));
rc.rules[8] = "42 | 42 8";
rc.rules[11] = "42 31 | 42 11 31";
rc.compile(15);

console.log(
  messages.split("\n").filter((msg) => msg.match(rc.regexes[0])).length
);
