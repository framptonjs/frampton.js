import curry from 'frampton-utils/curry';
import Request from 'frampton-io/http/request';
import send from 'frampton-io/http/send';

/**
 * Perform an AJAX PATCH request and return an EventStream that reports the progress.
 *
 * @name patch
 * @method
 * @memberof Frampton.IO.Http
 * @param {String} url  Url to send request to
 * @param {Object} data Data to send with request
 * @returns {Frampton.Signals.EventStream} An EventStream of Response objects
 */
export default curry(function patch(url, data) {
  return send(null, Request(url, 'PATCH', (data || null)));
});