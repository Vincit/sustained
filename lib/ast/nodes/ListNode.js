const { AstNode } = require('./AstNode');

class ListNode extends AstNode {
  constructor(items) {
    super();
    this.items = items;
  }
}

module.exports = {
  ListNode
};
