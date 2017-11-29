const { AstNode } = require('./AstNode');

const OrderByDir = {
  Asc: 'asc',
  Desc: 'desc'
};

class OrderByNode extends AstNode {
  constructor(orderBy, dir) {
    super();

    this.orderBy = orderBy;
    this.dir = dir || null;
  }
}

module.exports = {
  OrderByNode,
  OrderByDir
};
