import Task from 'frampton-data/task';

//+ fail :: x -> Task x a
export default function fail(err) {
  return new Task(function(reject, _) {
    return reject(err);
  });
}