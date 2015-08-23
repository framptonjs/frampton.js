import Frampton from 'frampton/namespace';
import EventStream from 'frampton-signals/event_stream';
import { merge } from 'frampton-signals/event_stream';
import Behavior from 'frampton-signals/behavior';
import empty from 'frampton-signals/empty';
import interval from 'frampton-signals/interval';
import sequential from 'frampton-signals/sequential';
import nullStream from 'frampton-signals/null';
import send from 'frampton-signals/send';
import changes from 'frampton-signals/changes';
import stepper from 'frampton-signals/stepper';
import accumB from 'frampton-signals/accum_b';
import toggle from 'frampton-signals/toggle';
import map from 'frampton-signals/map';
import map2 from 'frampton-signals/map2';
import map3 from 'frampton-signals/map3';
import map4 from 'frampton-signals/map4';
import map5 from 'frampton-signals/map5';
import mapMany from 'frampton-signals/map_many';
import {
  nextEvent,
  endEvent,
  emptyEvent,
  errorEvent
} from 'frampton-signals/event';

Frampton.Signals             = {};
Frampton.Signals.EventStream = EventStream;
Frampton.Signals.Behavior    = Behavior;
Frampton.Signals.nextEvent   = nextEvent;
Frampton.Signals.endEvent    = endEvent;
Frampton.Signals.emptyEvent  = emptyEvent;
Frampton.Signals.errorEvent  = errorEvent;
Frampton.Signals.empty       = empty;
Frampton.Signals.interval    = interval;
Frampton.Signals.merge       = merge;
Frampton.Signals.sequential  = sequential;
Frampton.Signals.nullStream  = nullStream;
Frampton.Signals.send        = send;
Frampton.Signals.changes     = changes;
Frampton.Signals.stepper     = stepper;
Frampton.Signals.accumB      = accumB;
Frampton.Signals.toggle      = toggle;
Frampton.Signals.map         = map;
Frampton.Signals.map2        = map2;
Frampton.Signals.map3        = map3;
Frampton.Signals.map4        = map4;
Frampton.Signals.map5        = map5;
Frampton.Signals.mapMany     = mapMany;