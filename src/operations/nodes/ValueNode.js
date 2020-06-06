import { OperationNode } from './OperationNode'

class ValueNode extends OperationNode {
  constructor(value) {
    super()
    this.value = value
  }
}

export { ValueNode }
