import { curry } from 'frampton-utils';
import map from 'frampton-monad/map';
import ap from 'frampton-monad/ap';

//+ liftA2 :: (a -> b) -> Monad a -> Monad b
export default curry(function(fn, Ap1, Ap2) {
  return ap(Ap2, map(Ap1, (a) => {
    return (b) => {
      return fn(a, b);
    };
  }))
});