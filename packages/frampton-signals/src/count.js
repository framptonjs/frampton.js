import stepper from 'frampton-signals/stepper';

export default function count(stream) {
  var i = 0;
  return stepper(0, stream.map(() => {
    return ++i;
  }));
}