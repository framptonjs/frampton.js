import Frampton from 'frampton/namespace';
import isSomething from 'frampton-utils/is_something';

export default function error(msg, data) {

  if (Frampton.isDev()) {

    if (isSomething(console.error)) {
      if (isSomething(data)) {
        console.error(msg, data);
      } else {
        console.error(msg);
      }
    } else if (isSomething(console.log)) {
      if (isSomething(data)) {
        console.log(('Error: ' + msg), data);
      } else {
        console.log(('Error: ' + msg));
      }
    }
  }

  return msg;
}