import reverseList from 'frampton-list/reverse';

export default function flip_args(fn) {
  return function flipped(...args) {
    return fn(...reverseList(args));
  };
}
