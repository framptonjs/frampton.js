import Request from 'frampton-io/http/request';
import send from 'frampton-io/http/send';

export default function get(url) {
  return send(null, Request(url));
}