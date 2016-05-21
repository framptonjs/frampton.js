import documentCache from 'frampton-events/document_cache';
import getEventSignal from 'frampton-events/get_event_signal';

/**
 * @name getDocumentSignal
 * @memberof Frampton.Events
 * @static
 * @private
 * @param {String} name Event name to look up
 * @returns {Frampton.Signal.Signal}
 */
export default function get_document_signal(name) {
  return documentCache(name, () => {
    return getEventSignal(name, document);
  });
}