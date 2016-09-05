import isArray from 'frampton-utils/is_array';

const blacklist =
  ['ctor', 'constructor', 'get', 'set', 'update'];

export default function validate_names(names) {

  if (!isArray(names)) {
    throw new Error(
      'Frampton.Data.Union must receive an array of fields for each type'
    );
  }

  const len = names.length;
  for (let i = 0; i < len; i++) {
    let name = names[i];
    if (blacklist.indexOf(name) !== -1) {
      throw new Error(
        `Frampton.Data.Union recieved reserved field name ${name}`
      );
    }
  }
}
