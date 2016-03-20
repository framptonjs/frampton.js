import { createSignal } from 'frampton-signal/create';

export default function combine(mapping, parents) {
  return createSignal((self) => {
    self(mapping.apply(null, parents.map((parent) => parent._value)));
  }, parents);
}