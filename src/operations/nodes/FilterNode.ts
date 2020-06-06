import { OperationNode } from './OperationNode'

export enum Bool {
  And = 'and',
  Or = 'or',
}

export class FilterNode extends OperationNode {
  lhs: OperationNode
  op: string
  rhs: OperationNode
  bool: Bool
  not: boolean

  constructor(lhs: OperationNode, op: string, rhs: OperationNode, bool: Bool, not: boolean) {
    super()

    this.lhs = lhs
    this.op = op
    this.rhs = rhs

    this.bool = bool
    this.not = not
  }
}
