/**
 * @name Response
 * @method
 * @memberof Frampton.IO
 * @param {String} status       Current status of request
 * @param {Number} [progress=0] Current progress (0-1) of request
 * @param {Object} [data=null]  Data returned by request
 * @returns {Object}
 */
export default function Response(status, progress, data) {
  return {
    status   : status,
    progress : (progress || 0),
    complete : (progress === 1),
    data     : (data || null)
  };
}