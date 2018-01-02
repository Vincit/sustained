const { parseIdentifier } = require('./parseIdentifier');
const { isArray } = require('../../utils/typeUtils');

function parseUsing(args, opts) {
  if (isArray(args[0])) {
    return parseArray(args[0], opts);
  } else {
    return parseArray(args, opts);
  }
}

function parseArray(array, opts) {
  return array.map(it => parseIdentifier(it, opts));
}

module.exports = {
  parseUsing
};
