const fs = require("fs");
let data = String(fs.readFileSync("./data.txt"));

class Edge {
  constructor(quantity, node) {
    this.quantity = quantity;
    this.node = node;
  }
}

class Node {
  constructor(adj, color, graph) {
    this.graph = graph;
    this.adj = adj;
    this.color = color;
    this.name = `${adj} ${color}`;
    this.inbound = [];
  }

  compileOutboundLinks(edgeStrings) {
    this.outbound = this.parseEdges(edgeStrings);
  }

  parseEdges(edgeStrings) {
    if (edgeStrings === "no other bags.") return [];

    return edgeStrings
      .split(",")
      .map((s) => s.trim())
      .reduce((acc, curr) => {
        const edge = this.parseEdgeContent(curr);
        if (!edge) return acc;
        else return [...acc, edge];
      }, []);
  }

  parseEdgeContent(contentDescriptor) {
    if (contentDescriptor === "no other bags.") {
      return;
    }

    try {
      const [_, quantity, adj, color] = contentDescriptor.match(
        /^(\d+)\s+(\w+)\s+(\w+)\s+bags?\.?$/
      );
      return new Edge(
        parseInt(quantity),
        this.graph.maybeCreateNode(adj, color)
      );
    } catch (e) {
      throw e;
    }
  }

  toString() {
    return [this.adj, this.color, JSON.stringify(this.meta)].join("\n");
  }
}

class Graph {
  constructor(data) {
    this.nodes = {};
    data.forEach((nodeString) => {
      const [_, adj, color, edgeStrings] = nodeString.match(
        /^(\w+)\s(\w+)\s+bags contain?\s+(.*)$/
      );

      const node = this.maybeCreateNode(adj, color);
      node.compileOutboundLinks(edgeStrings);

      node.outbound.forEach((edge) => {
        const outboundNode = this.maybeCreateNode(edge.adj, edge.color);
        outboundNode.inbound.push(node);
      });
    });
  }

  /**
   * Maybe create a node if it doesn't exist yet.
   * @param {string} adj
   * @param {string} color
   */
  maybeCreateNode(adj, color) {
    const name = `${adj} ${color}`;
    return (this.nodes[name] = this.nodes[name] || new Node(adj, color, this));
  }

  countChildrenForNode(node) {
    if (!node.outbound.length) return 0;

    const retval = node.outbound.reduce((acc, edge) => {
      const count =
        acc +
        edge.quantity +
        edge.quantity * this.countChildrenForNode(edge.node);
      return count;
    }, 0);

    return retval;
  }

  getParentsForNode(node) {
    console.log(node.name);
    return node.inbound.reduce((acc, parentNode) => {
      if (!parentNode)
        throw new Error("Edge not found", parentNode.adj, parentNode.color);

      acc[parentNode.name] = parentNode;
      Object.assign(acc, this.getParentsForNode(parentNode));
      return acc;
    }, {});
  }
}

const graph = new Graph(data.split("\n"));

// part 1
// const parents = graph.getParentsForNode(graph.nodes["shiny gold"]);
// console.log(parents);
// console.log(Object.keys(parents).length);

// part 2
const node = graph.nodes["shiny gold"];
console.log(node);
console.log(graph.countChildrenForNode(node));
