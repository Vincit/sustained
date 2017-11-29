function isPlainObject(val) {
  return (
    val !== null && typeof val === 'object' && (!val.constructor || val.constructor === Object)
  );
}

function isObject(val) {
  return val !== null && typeof val === 'object';
}

function isString(val) {
  return typeof val === 'string';
}

function isFunction(val) {
  return typeof val === 'function';
}

function isBoolean(val) {
  return typeof val === 'boolean';
}

function isNumber(val) {
  return typeof val === 'number';
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
  isFunction,
  isBoolean,
  isObject,
  isNumber
};
