import { AstNode } from './AstNode'

class InsertNode extends AstNode {
  constructor(rows) {
    super()
    this.rows = rows
  }
}

export { InsertNode }
