import create from 'frampton-data/task/create';

//+ fail :: x -> Task x a
export default function fail(err) {
  return create((sinks) => sinks.reject(err));
}