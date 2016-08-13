import Success from 'frampton-data/result/success';
import Failure from 'frampton-data/result/failure';

export default function from_throwable(fn) {
  return function(...args) {
    try {
      const value = fn(...args);
      return Success(value);
    } catch(e) {
      return Failure(e);
    }
  };
}
