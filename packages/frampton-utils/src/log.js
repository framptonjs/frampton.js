import Frampton from 'frampton/namespace';
import isSomething from 'frampton-utils/is_something';

export default function log(msg, data) {

  if (Frampton.isDev() && isSomething(console.log)) {
    if (isSomething(data)) {
      console.log(msg, data);
    } else {
      console.log(msg);
    }
  }

  return msg;
}