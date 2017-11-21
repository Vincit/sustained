const { AstNode } = require('./AstNode');

class ObjectPropertyNode extends AstNode {
  constructor(key, value) {
    super();

    this.key = key;
    this.value = value;
  }

  transform(visitor) {
    this.key = this.key.transform(visitor);
    this.value = this.value.transform(visitor);

    return this.visit(visitor);
  }
}

module.exports = {
  ObjectPropertyNode
};
