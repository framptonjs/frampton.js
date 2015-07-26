import get from 'frampton-utils/get';

//+ progress :: EventStream Response -> EventStream Number
export default function progress(stream) {
  return stream.map(get('progress'));
}