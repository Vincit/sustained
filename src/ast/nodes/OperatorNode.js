import { AstNode } from './AstNode'

class OperatorNode extends AstNode {
  constructor(operator) {
    super()
    this.operator = operator
  }
}

export { OperatorNode }
