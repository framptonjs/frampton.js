import noop from 'frampton-utils/noop';

/**
 * @name validSinks
 * @param {Object} sinks - Sinks to validate
 * @returns {Object} The validated sinks
 */
export default function valid_sinks(sinks) {
  return {
    reject: (sinks.reject || noop),
    resolve: (sinks.resolve || noop),
    progress: (sinks.progress || noop)
  };
}
