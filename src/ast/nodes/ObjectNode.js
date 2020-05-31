import { AstNode } from './AstNode'

class ObjectNode extends AstNode {
  constructor(propeties) {
    super()
    this.properties = propeties
  }
}

export { ObjectNode }
