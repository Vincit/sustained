class AstNode {
  constructor() {
    this.type = this.constructor.name;
  }

  static create(...args) {
    return new this(...args);
  }

  visit(visitor) {
    const visit = visitor[this.type];

    if (visit) {
      return visit(this) || this;
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
