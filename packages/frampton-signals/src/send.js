import curry from 'frampton-utils/curry';

// send :: EventStream a -> EventStream b -> Task [a, b] -> ()
export default curry(function send(errors, values, task) {
  task.run(
    err => errors.pushNext(err),
    val => values.pushNext(val)
  );
});