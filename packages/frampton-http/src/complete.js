import get from 'frampton-utils/get';
import isComplete from 'frampton-http/is_complete';

//+ complete :: EventStream Respose -> EventStream Any
export default function complete(stream) {
  return stream.filter(isComplete).map(get('data'));
}