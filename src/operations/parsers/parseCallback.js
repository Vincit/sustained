export function parseSubQueryCallback(callback, opts) {
  let subQueryBuilderClass = opts.subQueryBuilderClass
  let subBuilder = new opts.subQueryBuilderClass({ subQueryBuilderClass })

  subBuilder = callback.call(subBuilder, subBuilder) || subBuilder
  return subBuilder.operationNode
}
