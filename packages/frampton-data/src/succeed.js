import Task from 'frampton-data/task';

//+ succeed :: a -> Task x a
export default function succeed(val) {
  return new Task(function(_, resolve) {
    return resolve(val);
  });
}