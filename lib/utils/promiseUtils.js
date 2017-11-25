const { isObject, isFunction } = require('./typeUtils');

function isPromise(val) {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
}

function asyncTry(cb) {
  try {
    const result = cb();

    if (isPromise(result)) {
      return result;
    } else {
      return Promise.resolve(result);
    }
  } catch (err) {
    return Promise.reject(err);
  }
}

module.exports = {
  asyncTry
};
