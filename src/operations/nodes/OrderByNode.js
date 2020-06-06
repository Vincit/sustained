import { OperationNode } from './OperationNode'

const OrderByDir = {
  Asc: 'asc',
  Desc: 'desc',
}

class OrderByNode extends OperationNode {
  constructor(orderBy, dir) {
    super()

    this.orderBy = orderBy
    this.dir = dir || null
  }
}

export { OrderByNode, OrderByDir }
