import isUndefined from 'frampton-utils/is_undefined';

export default function validate_args(validators, args) {
  for (let i = 0; i < validators.length; i++) {
    if (isUndefined(args[i]) || !validators[i](args[i])) {
      return false;
    }
  }
  return true;
}