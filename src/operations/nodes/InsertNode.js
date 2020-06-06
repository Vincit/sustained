import { OperationNode } from './OperationNode'

class InsertNode extends OperationNode {
  constructor(rows) {
    super()
    this.rows = rows
  }
}

export { InsertNode }
