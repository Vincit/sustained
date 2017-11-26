const { isAstNode } = require('../../utils/typeUtils');

class AstNode {
  constructor() {
    this.type = this.constructor.name;
  }

  static create(...args) {
    return new this(...args);
  }

  visit(visitor, ...args) {
    let constructor = this.constructor;
    let visit = undefined;

    while (constructor && visit === undefined) {
      visit = visitor[constructor.name];
      constructor = constructor.__proto__;
    }

    if (visit) {
      const result = visit.call(visitor, this, ...args);

      if (result === undefined) {
        return this;
      } else {
        return result;
      }
    }

    return this;
  }

  visitAllChildren(visitor, ...args) {
    Object.keys(this).forEach(prop => {
      const value = this[prop];

      if (Array.isArray(value)) {
        value.forEach(node => {
          if (isAstNode(node)) {
            node.visit(visitor, ...args);
          }
        });
      } else if (isAstNode(value)) {
        value.visit(visitor, ...args);
      }
    });
  }
}

Object.defineProperties(AstNode.prototype, {
  isSustainedAstNode: {
    enumerable: false,
    value: true
  }
});

module.exports = {
  AstNode
};
