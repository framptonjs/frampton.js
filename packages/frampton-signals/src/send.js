import { curry } from 'frampton-utils';
import { nextEvent } from 'frampton-signals/event';

// send :: EventStream a -> EventStream b -> Task [a, b] -> ()
export default curry(function send(errors, values, task) {
  task.run(
    err => errors.push(nextEvent(err)),
    val => values.push(nextEvent(val))
  );
});