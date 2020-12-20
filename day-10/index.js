const fs = require("fs");
let data = String(fs.readFileSync("./data.txt")).trim().split("\n");

class Graph {
  constructor(goalValue) {
    this.nodes = {};
  }

  getKeysAsInts() {
    return Object.keys(this.nodes).map((i) => parseInt(i));
  }

  getDeviceNode() {
    const sortedKeys = this.getKeysAsInts().sort((a, b) => a - b);

    return new Node(sortedKeys[sortedKeys.length - 1] + 3, this);
  }

  compile() {
    this.terminalNode = this.getDeviceNode();
    this.nodes[this.terminalNode.value] = this.terminalNode;
    this.nodes[0] = new Node(0, this);

    this.getKeysAsInts().forEach((key) => {
      const fromNode = this.nodes[key];
      [key + 1, key + 2, key + 3].forEach((target) => {
        const maybeNode = this.nodes[target];
        if (maybeNode) {
          maybeNode.in.push(new Edge(fromNode));
          fromNode.out.push(maybeNode);
        }
      });
    });
  }

  start() {
    return this.nodes[0];
  }
}

class Node {
  constructor(value, graph) {
    this.out = [];
    this.in = [];
    this.value = parseInt(value);
    this.graph = graph;
  }

  traverse() {
    if (this == this.graph.terminalNode) return 1;

    this.possibilities =
      this.possibilities ||
      this.next().reduce((sum, curr) => sum + curr.traverse(), 0);

    return this.possibilities;
  }

  next() {
    const nextPossible = [];
    for (let i = 1; i <= 3; i++) {
      const maybeNode = this.graph.nodes[this.value + i];
      if (maybeNode) {
        nextPossible.push(maybeNode);
      }
    }

    return nextPossible.length ? nextPossible : false;
  }
}

class Edge {
  constructor(node) {
    this.node = node;
  }
}

const graph = new Graph();

data.forEach(
  (nodeValue) => (graph.nodes[nodeValue] = new Node(nodeValue, graph))
);

graph.compile();

// const differences = {
//   1: 0,
//   2: 0,
//   3: 0,
// };

// let lastNode = graph.start();

// differences[lastNode.value] = differences[lastNode.value] + 1;

// if (!lastNode) throw new Error("No starting node");

// while ((currNode = lastNode.next())) {
//   console.log(lastNode.value, currNode.value);
//   differences[currNode.value - lastNode.value] =
//     differences[currNode.value - lastNode.value] + 1;
//   lastNode = currNode;
// }

// if (lastNode.value !== graph.terminalNode.value)
//   throw new Error("did not terminate");

// console.log(differences);

graph.start().traverse();
console.log(graph.nodes[0].possibilities);
