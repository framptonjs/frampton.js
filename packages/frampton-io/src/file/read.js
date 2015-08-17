import EventStream from 'frampton-signals/event_stream';
import { errorEvent, nextEvent } from 'frampton-signals/event';
import Response from 'frampton-io/response';
import ReadApi from 'frampton-io/file/read_api';

// read_file :: Object -> File -> EventStream Response
export default function read_file(method, file) {

  return new EventStream(function seed_read_file(sink) {

    var reader = ReadApi();

    reader.addEventListener('loadstart', (evt) => {
      sink(nextEvent(Response('start', 0, null)));
    });

    reader.addEventListener('progress', (evt) => {
      sink(nextEvent(Response('progress', (evt.loaded / evt.total), null)));
    });

    reader.addEventListener('load', (evt) => {
      sink(nextEvent(Response('complete', 1, evt.target.result)));
    });

    reader.addEventListener('error', (err) => {
      sink(errorEvent(Response('error', 0, err.message)));
    });

    reader.addEventListener('abort', (evt) => {
      sink(errorEvent(Response('abort', 0, null)));
    });

    switch (method) {
      case 'DATA_URL':
        reader.readAsDataURL(file);
        break;

      case 'ARRAY_BUFFER':
        reader.readAsArrayBuffer(file);
        break;

      case 'TEXT':
        reader.readAsText(file);
        break;

      case 'BINARY_STRING':
        reader.readAsBinaryString(file);
        break;
    }

  });
}