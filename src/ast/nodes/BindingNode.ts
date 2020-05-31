import { AstNode } from './AstNode'

export class BindingNode extends AstNode {
  match: string
  index: number
  node: AstNode

  constructor(match: string, index: number, node: AstNode) {
    super()

    this.match = match
    this.index = index
    this.node = node
  }
}
