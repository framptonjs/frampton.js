import curry from 'frampton-utils/curry';
import isFunction from 'frampton-utils/is_function';

// contains :: Dom -> Dom -> Boolean
export default curry((parent, child) => {
  if (parent === child) {
    return true;
  } else if (isFunction(parent.contains)) {
    return parent.contains(child);
  } else {
    while (child = child.parentNode) {
      if (parent === child) {
        return true;
      }
      return false;
    }
  }
});