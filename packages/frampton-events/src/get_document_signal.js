import documentCache from 'frampton-events/document_cache';
import getEventSignal from 'frampton-events/get_event_signal';

export default function get_document_signal(name) {
  return documentCache(name, () => {
    return getEventSignal(name, document);
  });
}