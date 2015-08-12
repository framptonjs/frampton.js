import curry from 'frampton-utils/curry';

// contains :: Dom -> Dom -> Boolean
export default curry(function contains(parent, child) {
  return (parent === child || parent.contains(child));
});