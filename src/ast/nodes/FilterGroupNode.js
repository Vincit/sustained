import { ListNode } from './ListNode'

class FilterGroupNode extends ListNode {
  constructor(items, bool, not) {
    super(items)

    this.bool = bool
    this.not = not
  }
}

export { FilterGroupNode }
