const { ListNode } = require('./ListNode');

class FilterGroupNode extends ListNode {
  constructor(items, bool, not) {
    super(items);

    this.bool = bool;
    this.not = not;
  }
}

module.exports = {
  FilterGroupNode
};
