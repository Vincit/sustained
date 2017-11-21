function isPlainObject(val) {
  return (
    val !== null && typeof val === 'object' && (!val.constructor || val.constructor === Object)
  );
}

function isString(val) {
  return typeof val === 'string';
}

function isFunction(val) {
  return typeof val === 'function';
}

function isAstBuilder(val) {
  return val !== null && typeof val === 'object' && val.isSustainedAstBuilder;
}

function isAstNode(val) {
  return val !== null && typeof val === 'object' && val.isSustainedAstNode;
}

module.exports = {
  isString,
  isAstNode,
  isPlainObject,
  isAstBuilder,
  isFunction
};
