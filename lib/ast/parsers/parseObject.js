const { ObjectNode, ObjectPropertyNode } = require('../nodes');
const { parseIdentifier } = require('./parseIdentifier');
const { parseValue } = require('./parseValue');

function parseIdValueObject(value, opts) {
  const keys = Object.keys(value);
  const properties = new Array(keys.length);

  for (let i = 0, l = keys.length; i < l; ++i) {
    const key = keys[i];
    const val = value[key];

    properties[i] = ObjectPropertyNode.create(parseIdentifier(key), parseValue(val, opts));
  }

  return ObjectNode.create(properties);
}

module.exports = {
  parseIdValueObject
};
