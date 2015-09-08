/**
 * @name Request
 * @method
 * @memberof Frampton.IO.Http
 * @param {String} url            Url to send request to.
 * @param {String} [method='GET'] Http request method to use
 * @param {Object} [data=null]    Data to send with request
 * @param {Object} [headers={}]   Headers to add to request
 * @returns {Object}
 */
export default function Request(url, method, data, headers) {
  return {
    url     : url,
    method  : (method || 'GET'),
    body    : (data || null),
    headers : (headers || {})
  };
}