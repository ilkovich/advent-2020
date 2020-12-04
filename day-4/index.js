const fs = require("fs");
const data = String(fs.readFileSync("./data.txt"));

const valid = {};

const test = `
ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in
`;

const test2 = `
pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980
hcl:#623a2f

eyr:2029 ecl:blu cid:129 byr:1989
iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm

hcl:#888785
hgt:164cm byr:2001 iyr:2015 cid:88
pid:545766238 ecl:hzl
eyr:2022

iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719
`;

function validIntRange(str, min, max) {
  const num = parseInt(str);
  return num && num >= min && num <= max;
}

class Passport {
  constructor() {
    this.config = "";

    this.expectedFields = [
      "byr",
      "iyr",
      "eyr",
      "hgt",
      "hcl",
      "ecl",
      "pid",
      //   "cid",
    ];

    this.validations = {
      byr: (yearString) => {
        return (
          /^\d{4}$/.test(yearString) && validIntRange(yearString, 1920, 2002)
        );
      },
      iyr: (yearString) => {
        return (
          /^\d{4}$/.test(yearString) && validIntRange(yearString, 2010, 2020)
        );
      },
      eyr: (yearString) => {
        return (
          /^\d{4}$/.test(yearString) && validIntRange(yearString, 2020, 2030)
        );
      },
      hgt: (str) => {
        const match = str.match(/^(\d+)(cm|in)$/);

        if (!match) return false;

        switch (match[2]) {
          case "cm":
            return validIntRange(match[1], 150, 193);
            break;
          case "in":
            return validIntRange(match[1], 59, 76);
            break;
          default:
            return false;
            break;
        }
      },
      hcl: (str) => /^#[0-9a-f]{6}$/.test(str),
      ecl: (str) => /^amb|blu|brn|gry|grn|hzl|oth$/.test(str),
      pid: (str) => /^[0-9]{9}$/.test(str),
      cid: (str) => true,
    };
  }

  append(line) {
    if (this.compiled) {
      throw new Error("Already compiled.");
    }

    this.config += ` ${line}`;
  }

  compile() {
    this.compiled = true;
    const meta = {};
    this.config
      .trim()
      .split(" ")
      .map((curr) => {
        const parts = curr.split(":");
        if (parts.length !== 2) throw new Error("unexpected parts");
        meta[parts[0].trim()] = parts[1].trim();
      });

    this.meta = meta;
    return this;
  }

  isValidPartOne() {
    if (!this.compiled) this.compile();

    for (let i = 0; i < this.expectedFields.length; i++) {
      const curr = this.expectedFields[i];
      if (!Boolean(this.meta[curr])) {
        return false;
      }
    }

    return true;
  }

  isValid() {
    if (!this.compiled) this.compile();

    for (let i = 0; i < this.expectedFields.length; i++) {
      const curr = this.expectedFields[i];
      if (!this.meta[curr] || !this.validations[curr](this.meta[curr])) {
        return false;
      } else {
        valid[curr] = valid[curr] || [];
        valid[curr].push(this.meta[curr]);
      }
    }

    // console.log(JSON.stringify(this.meta));

    return true;
  }
}

const passports = data
  .trim()
  .split("\n")
  .reduce(
    (passports, curr) => {
      if (curr.trim() === "") {
        passport = new Passport();
        passports.push(passport);
      } else {
        passports[passports.length - 1].append(curr);
      }

      return passports;
    },
    [new Passport()]
  );

const result = passports.reduce((acc, curr) => {
  return acc + (curr.isValid() ? 1 : 0);
}, 0);
