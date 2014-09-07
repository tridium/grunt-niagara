function isObject(obj) {
  return obj && typeof obj === 'object' && !Array.isArray(obj);
}

function eachProp(obj, func) {
  for (var propName in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, propName)) {
      func(propName, obj[propName]);
    }
  }
}

/**
 * Does a deep extend of an object, but only deep-extends actual Object
 * properties. Arrays are not extended but are overwritten directly.
 */
function deepExtend() {
  if (arguments.length === 0) {
    return false;
  }

  if (arguments.length === 1) {
    return arguments[0];
  }

  var target = {},
      args = Array.prototype.slice.call(arguments);

  args.forEach(function (src) {
    eachProp(src, function (propName, srcProp) {
      var targetProp = target[propName];

      if (isObject(srcProp) && isObject(targetProp)) {
        target[propName] = deepExtend(targetProp, srcProp);
      } else if (srcProp !== null && srcProp !== undefined) {
        target[propName] = srcProp;
      }
    });
  });

  return target;
}

module.exports = deepExtend;