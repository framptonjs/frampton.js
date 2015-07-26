import isError from 'frampton-http/is_error';

//+ error :: EventStream Respose -> EventStream Response
export default function error(stream) {
  return stream.filter(isError);
}