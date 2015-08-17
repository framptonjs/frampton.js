import get from 'frampton-io/http/get';

export default function get_newest(source) {
  return source.chainLatest((url) => {
    return get(url);
  });
}