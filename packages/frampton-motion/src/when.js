import noop from 'frampton-utils/noop';
import { Transition } from 'frampton-motion/transition';

//+ when :: [Transition] -> Transition
export default function when(...transitions) {

  var transition = new Transition();

  transition.reverse = function when_reverse() {
    return when.apply(null, transitions.map((trans) => {
      return trans.reverse();
    }));
  };

  transition.run = function when_run(resolve) {

    var len = transitions.length;
    var count = 0;

    transitions.forEach((trans) => {
      console.log('trans: ', trans);
      trans.run(() => {
        count = count + 1;
        if (count === len) {
          (resolve || noop)();
        }
      });
    });
  };

  return transition;
}