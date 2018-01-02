const { UsingNode } = require('../nodes');
const { parseIdentifier } = require('./parseIdentifier');

function parseUsing(args) {
  if (Array.isArray(args[0])) {
    args = args[0];
  }

  return args.map(arg => parseIdentifier(arg));
}

module.exports = {
  parseUsing
};
