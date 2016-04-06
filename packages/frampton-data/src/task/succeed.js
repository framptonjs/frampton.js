import create from 'frampton-data/task/create';

//+ succeed :: a -> Task x a
export default function succeed(val) {
  return create((_, resolve) => resolve(val));
}