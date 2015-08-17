import isError from 'frampton-io/is_error';

//+ error :: EventStream Respose -> EventStream Response
export default function error(stream) {
  return stream.filter(isError);
}