import Frampton from 'frampton/namespace';

export default function log(msg, data) {

  if (typeof console.log !== 'undefined' && Frampton.isDev()) {
    if (data) {
      console.log(msg, data);
    } else {
      console.log(msg);
    }
  }

  return msg;
}