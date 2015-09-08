import curry from 'frampton-utils/curry';
import Request from 'frampton-io/http/request';
import send from 'frampton-io/http/send';

/**
 * Perform an AJAX PUT request and return an EventStream that reports the progress.
 *
 * @name put
 * @method
 * @memberof Frampton.IO.Http
 * @param {String} url  Url to send request to
 * @param {Object} data Data to send with request
 * @returns {Frampton.Signals.EventStream} An EventStream of Response objects
 */
export default curry(function post(url, data) {
  return send(null, Request(url, 'PUT', (data || null)));
});