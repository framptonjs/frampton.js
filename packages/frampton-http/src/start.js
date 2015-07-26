import isStart from 'frampton-http/is_start';

//+ start :: EventStream Respose -> EventStream Response
export default function start(stream) {
  return stream.filter(isStart);
}