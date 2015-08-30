import curry from 'frampton-utils/curry';
import stepper from 'frampton-signals/stepper';

export default curry(function toggle(stream1, stream2) {
  return stepper(false, stream1.map(true).merge(stream2.map(false)));
});