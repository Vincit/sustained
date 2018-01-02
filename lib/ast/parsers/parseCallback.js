function parseSubQueryCallback(callback, opts) {
  let subQueryBuilderClass = opts.subQueryBuilderClass;
  let subBuilder = opts.subQueryBuilderClass.create({ subQueryBuilderClass });

  subBuilder = callback.call(subBuilder, subBuilder) || subBuilder;
  return subBuilder.ast;
}

module.exports = {
  parseSubQueryCallback
};
