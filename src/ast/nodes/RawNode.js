import { AstNode } from './AstNode'

class RawNode extends AstNode {
  constructor(sql, bindings) {
    super()

    this.sql = sql
    this.bindings = bindings
  }
}

export { RawNode }
