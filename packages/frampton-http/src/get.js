import Request from 'frampton-http/request';
import send from 'frampton-http/send';

export default function get(url) {
  return send(null, Request(url));
}