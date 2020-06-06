import { OperationNode } from './OperationNode'

export class AliasableNode extends OperationNode {
  node: OperationNode
  alias: string | null

  constructor(node: OperationNode, alias?: string) {
    super()

    this.node = node
    this.alias = alias || null
  }
}
