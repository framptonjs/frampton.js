import read from 'frampton-io/file/read';

export default function data_url(file) {
  return read('DATA_URL', file);
}