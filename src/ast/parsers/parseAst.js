import { isAstNode, isAstBuilder } from '../../utils/typeUtils'

export function parseAst(val) {
  if (isAstNode(val)) {
    return val.clone()
  } else if (isAstBuilder(val)) {
    return val.ast.clone()
  } else {
    throw new Error('Not an AST node')
  }
}
