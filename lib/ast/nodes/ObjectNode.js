const { AstNode } = require('./AstNode');

class ObjectNode extends AstNode {
  constructor(propeties) {
    super();
    this.properties = propeties;
  }

  transform(visitor) {
    this.properties = this.properties.map(it => it.transform(visitor));
    return this.visit(visitor);
  }
}

module.exports = {
  ObjectNode
};
