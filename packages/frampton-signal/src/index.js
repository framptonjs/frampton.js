import Frampton from 'frampton/namespace';
import create from 'frampton-signal/create';
import { mergeMany } from 'frampton-signal/create';
import stepper from 'frampton-signal/stepper';
import combine from 'frampton-signal/combine';
import swap from 'frampton-signal/swap';
import toggle from 'frampton-signal/toggle';

/**
 * @name Signal
 * @namespace
 * @memberof Frampton
 */
Frampton.Signal           = {};
Frampton.Signal.create    = create;
Frampton.Signal.stepper   = stepper;
Frampton.Signal.combine   = combine;
Frampton.Signal.mergeMany = mergeMany;
Frampton.Signal.swap      = swap;
Frampton.Signal.toggle    = toggle;