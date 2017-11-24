class AstNode {
  constructor() {
    this.type = this.constructor.name;
  }

  static create(...args) {
    return new this(...args);
  }

  visit(visitor, ...args) {
    const visit = visitor[this.type];

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

  transform(visitor) {
    return this.visit(visitor);
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
