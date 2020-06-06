import { OperationNode } from './OperationNode'

class IdentifierNode extends OperationNode {
  constructor(ids) {
    super()
    this.ids = ids
  }
}

export { IdentifierNode }
