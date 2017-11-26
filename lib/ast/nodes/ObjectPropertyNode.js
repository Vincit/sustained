const { AstNode } = require('./AstNode');

class ObjectPropertyNode extends AstNode {
  constructor(key, value) {
    super();

    this.key = key;
    this.value = value;
  }
}

module.exports = {
  ObjectPropertyNode
};
