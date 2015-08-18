import get from 'frampton-io/http/get';

// get_newest :: EventStream Url -> EventStream Response
export default function get_newest(source) {
  return source.chainLatest((url) => {
    return get(url);
  });
}