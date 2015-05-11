import isNothing from 'frampton-utils/is_nothing';

export default function isSomething(obj) {
  return !isNothing(obj);
}