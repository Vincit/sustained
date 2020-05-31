import { AstNode } from './AstNode'

const QueryType = {
  Select: 'select',
  Insert: 'insert',
  Update: 'update',
  Delete: 'delete',
}

class QueryNode extends AstNode {
  constructor() {
    super()

    this.queryType = QueryType.Select
    this.selectOptions = {}
    this.fromOptions = {}

    this.select = []
    this.from = []
    this.with = []
    this.where = []
    this.having = []
    this.orderBy = []
    this.groupBy = []
    this.join = []
    this.returning = []

    this.insert = null
    this.update = null
    this.limit = null
    this.offset = null
    this.alias = null
    this.schema = null
  }
}

export { QueryNode, QueryType }
