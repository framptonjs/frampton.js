import Frampton from 'frampton/namespace';
import isSomething from 'frampton-utils/is_something';

export default function warn(msg, data) {

  if (Frampton.isDev()) {

    if (isSomething(console.warn)) {
      if (isSomething(data)) {
        console.warn(msg, data);
      } else {
        console.warn(msg);
      }
    } else if (isSomething(console.log)) {
      if (isSomething(data)) {
        console.log(msg, data);
      } else {
        console.log(msg);
      }
    }
  }

  return msg;
}