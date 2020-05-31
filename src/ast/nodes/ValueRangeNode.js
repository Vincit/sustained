import { AstNode } from './AstNode'

class ValueRangeNode extends AstNode {
  constructor(min, max) {
    super()
    this.min = min
    this.max = max
  }
}

export { ValueRangeNode }
