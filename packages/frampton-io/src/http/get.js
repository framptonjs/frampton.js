import Request from 'frampton-io/http/request';
import urlBuilder from 'frampton-io/http/url';
import send from 'frampton-io/http/send';

/**
 * Perform an AJAX GET request and return an EventStream that reports the progress.
 *
 * @name get
 * @method
 * @memberof Frampton.IO.Http
 * @param {String} url    Url to send request to
 * @param {Object} [data] Data to send with request. Is encoded and appended to url.
 * @returns {Frampton.Signals.EventStream} An EventStream of Response objects
 */
export default function get(url, data) {
  return send(null, Request(urlBuilder(url, data)));
}