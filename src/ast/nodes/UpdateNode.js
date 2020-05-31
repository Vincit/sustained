import { AstNode } from './AstNode'

class UpdateNode extends AstNode {
  constructor(values) {
    super()
    this.values = values
  }
}

export { UpdateNode }
