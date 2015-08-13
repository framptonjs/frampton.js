// not :: Function -> a -> Boolean
export default function not(fn) {
  return function(arg) {
    return !fn(arg);
  };
}