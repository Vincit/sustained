import { OperationBuilder } from './OperationBuilder'
import { parseRaw } from '../parsers/parseRaw'

export class RawOperationBuilder extends OperationBuilder {
  constructor({ sql, bindings, operationNode } = {}) {
    super(operationNode || parseRaw(sql, bindings))
  }

  wrap(left, right) {
    this.operationNode.sql = left + this.operationNode.sql + right

    // We need to move each binding's position by left.length.
    this.operationNode.bindings.forEach((it) => {
      it.index += left.length
    })

    return this
  }

  clone() {
    return new this.constructor({
      operationNode: this.operationNode.clone(),
    })
  }
}

export function raw(sql, ...bindings) {
  return new RawOperationBuilder({
    sql,
    bindings,
  })
}
