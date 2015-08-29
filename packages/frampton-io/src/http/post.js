import curry from 'frampton-utils/curry';
import Request from 'frampton-io/http/request';
import send from 'frampton-io/http/send';

export default curry(function post(url, data) {
  return send(null, Request(url, 'POST', (data || null)));
});