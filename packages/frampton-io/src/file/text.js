import read from 'frampton-io/file/read';

export default function text(file) {
  return read('TEXT', file);
}