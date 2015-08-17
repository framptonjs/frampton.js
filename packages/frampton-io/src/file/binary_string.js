import read from 'frampton-io/file/read';

export default function binary_string(file) {
  return read('BINARY_STRING', file);
}