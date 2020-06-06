import { OperationNode } from './OperationNode'

class GroupByNode extends OperationNode {
  constructor(groupBy) {
    super()
    this.groupBy = groupBy
  }
}

export { GroupByNode }
