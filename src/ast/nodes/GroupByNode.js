import { AstNode } from './AstNode'

class GroupByNode extends AstNode {
  constructor(groupBy) {
    super()
    this.groupBy = groupBy
  }
}

export { GroupByNode }
