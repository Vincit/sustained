import { OperationNode } from './OperationNode'

class UpdateNode extends OperationNode {
  constructor(values) {
    super()
    this.values = values
  }
}

export { UpdateNode }
