import create from 'frampton-data/task/create';

//+ succeed :: a -> Task x a
export default function succeed(val) {
  return create((sinks) => sinks.resolve(val));
}