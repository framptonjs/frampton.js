import isStart from 'frampton-io/is_start';

//+ start :: EventStream Respose -> EventStream Response
export default function start(stream) {
  return stream.filter(isStart);
}