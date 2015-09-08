import stepper from 'frampton-signals/stepper';

/**
 * Creates a Behavior that counts events on the EventStream
 *
 * @name count
 * @method
 * @memberof Frampton.Signals
 * @param {Frampton.Signals.EventStream} stream
 * @returns {Frampton.Signals.Behavior}
 */
export default function count(stream) {
  var i = 0;
  return stepper(0, stream.map(() => {
    return ++i;
  }));
}