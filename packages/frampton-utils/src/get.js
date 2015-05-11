import curry from 'frampton-utils/curry';

//+ get :: String -> Object -> Any
export default curry(function(prop, obj) {
  return (obj[prop] || null);
});