import empty from 'frampton-signals/empty';

var instance = null;

export default function null_stream() {
  return (instance !== null) ? instance : (instance = empty());
}