import { AstNode } from './AstNode'

class ValueNode extends AstNode {
  constructor(value) {
    super()
    this.value = value
  }
}

export { ValueNode }
