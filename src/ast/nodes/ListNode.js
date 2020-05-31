import { AstNode } from './AstNode'

class ListNode extends AstNode {
  constructor(items) {
    super()
    this.items = items
  }
}

export { ListNode }
