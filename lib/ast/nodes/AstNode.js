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
    const props = Object.keys(this);

    for (let i = 0, lp = props.length; i < lp; ++i) {
      const prop = props[i];
      const value = this[prop];

      if (Array.isArray(value)) {
        for (let j = 0, lv = value.length; j < lv; ++j) {
          const item = value[j];

          if (isAstNode(item)) {
            item.visit(visitor, ...args);
          }
        }
      } else if (isAstNode(value)) {
        value.visit(visitor, ...args);
      }
    }
  }

  clone() {
    const copy = this.constructor.create();
    const props = Object.keys(this);

    for (let i = 0, lp = props.length; i < lp; ++i) {
      const prop = props[i];
      const value = this[prop];

      if (Array.isArray(value)) {
        const newValue = new Array(value.length);

        for (let j = 0, lv = value.length; j < lv; ++j) {
          const item = value[j];

          if (isAstNode(item)) {
            newValue[j] = item.clone();
          } else {
            newValue[j] = item;
          }
        }

        copy[prop] = newValue;
      } else if (isAstNode(value)) {
        copy[prop] = value.clone();
      } else {
        copy[prop] = value;
      }
    }

    return copy;
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
