import documentCache from 'frampton-events/document_cache';
import getEventStream from 'frampton-events/get_event_stream';

export default function get_document_stream(name) {
  return documentCache(name, () => {
    return getEventStream(name, document);
  });
}