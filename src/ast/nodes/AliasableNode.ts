import { AstNode } from './AstNode'

export class AliasableNode extends AstNode {
  node: AstNode
  alias: string | null

  constructor(node: AstNode, alias?: string) {
    super()

    this.node = node
    this.alias = alias || null
  }
}
