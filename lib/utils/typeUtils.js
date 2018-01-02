function isPlainObject(val) {
  return isObject(val) && (!val.constructor || val.constructor === Object);
}

function isObject(val) {
  return val !== null && typeof val === 'object';
}

function isArray(val) {
  return Array.isArray(val);
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

function isPrimitive(val) {
  return typeof val !== 'object';
}

function isNull(val) {
  return val === null;
}

function isUndefined(val) {
  return val === undefined;
}

function isDate(val) {
  return val instanceof Date;
}

function isAst(val) {
  return isAstBuilder(val) || isAstNode(val);
}

function isAstBuilder(val) {
  return isObject(val) && val.isSustainedAstBuilder;
}

function isAstNode(val) {
  return isObject(val) && val.isSustainedAstNode;
}

module.exports = {
  isAst,
  isArray,
  isString,
  isAstNode,
  isPlainObject,
  isAstBuilder,
  isPrimitive,
  isUndefined,
  isFunction,
  isBoolean,
  isObject,
  isNumber,
  isDate,
  isNull
};
