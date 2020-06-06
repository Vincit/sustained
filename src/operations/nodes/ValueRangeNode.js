import { OperationNode } from './OperationNode'

class ValueRangeNode extends OperationNode {
  constructor(min, max) {
    super()
    this.min = min
    this.max = max
  }
}

export { ValueRangeNode }
