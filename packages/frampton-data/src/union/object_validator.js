import curry from 'frampton-utils/curry';

export default curry(function object_validator(parent, child) {
  return (child.constructor === parent);
});