const { AstNode } = require('./AstNode');

class GroupByNode extends AstNode {
  constructor(groupBy) {
    super();
    this.groupBy = groupBy;
  }
}

module.exports = {
  GroupByNode
};
