import get from 'frampton-http/get';

export default function get_newest(source) {
  return source.chainLatest((url) => {
    return get(url);
  });
}