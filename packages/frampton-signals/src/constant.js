import Behavior from 'frampton-signals/behavior';

// constant :: a -> Behavior a
export default function constant(val) {
  return Behavior.of(val);
}