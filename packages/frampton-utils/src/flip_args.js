export default function flip_args(fn) {
  return function flipped(a, b) {
    return fn(b, a);
  };
}
