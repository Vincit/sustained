const { AstNode } = require('./AstNode');

class ListNode extends AstNode {
  constructor(items) {
    super();
    this.items = items;
  }

  transform(visitor) {
    this.items = this.items.map(it => it.transform(visitor));
    return this.visit(visitor);
  }
}

module.exports = {
  ListNode
};
