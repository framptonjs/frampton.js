import extend from 'frampton-utils/extend';
import EventStream from 'frampton-signals/event_stream';
import { nextEvent, errorEvent } from 'frampton-signals/event';
import ajax from 'frampton-http/ajax';
import Response from 'frampton-http/response';

var defaultSettings = {
  timeout : (10 * 1000)
};

export default function send(settings, request) {

  return new EventStream((sink) => {

    var req = ajax();
    var settings = extend({}, defaultSettings, settings);

    req.open(request.method, request.url, true);

    req.addEventListener('loadStart', function(evt) {
      sink(nextEvent(Response('start', 0, null)));
    });

    req.addEventListener('progress', function(evt) {
      sink(nextEvent(Response('progress', (evt.loaded / evt.total), null)));
    });

    req.addEventListener('error', function(err) {
      sink(errorEvent(Response('error', 0, err.message)));
    });

    req.addEventListener('timeout', function(err) {
      sink(errorEvent(Response('error', 0, 'timeout')));
    });

    req.addEventListener('load', function(evt) {
      sink(nextEvent(Response('complete', 1, evt.response)));
    });

    for (let key in request.headers) {
      req.setRequestHeader(key, request.headers[key]);
    }

    req.timeout = settings.timeout;

    req.send(request.body);
  });
}