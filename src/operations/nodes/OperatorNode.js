import { OperationNode } from './OperationNode'

class OperatorNode extends OperationNode {
  constructor(operator) {
    super()
    this.operator = operator
  }
}

export { OperatorNode }
