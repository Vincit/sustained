import { AstNode } from './AstNode'

class IdentifierNode extends AstNode {
  constructor(ids) {
    super()
    this.ids = ids
  }
}

export { IdentifierNode }
