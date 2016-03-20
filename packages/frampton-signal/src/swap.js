import curry from 'frampton-utils/curry';
import stepper from 'frampton-signal/stepper';

export default curry(function toggle(sig1, sig2) {
  return stepper(false, sig1.map(true).merge(sig2.map(false)));
});