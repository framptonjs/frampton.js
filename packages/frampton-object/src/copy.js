import forEach from 'frampton-object/for_each';

export default function copy_object(obj) {
  var newObj = {};
  forEach((value, key) => {
    newObj[key] = value;
  }, obj);
  return newObj;
}