import Frampton from 'frampton/namespace';
import setHash from 'frampton-history/set_hash';
import pushState from 'frampton-history/push_state';
import replaceState from 'frampton-history/replace_state';
import change from 'frampton-history/history_change';
import depth from 'frampton-history/depth';
import state from 'frampton-history/state';
import search from 'frampton-history/search';
import hash from 'frampton-history/hash';
import path from 'frampton-history/path';

/**
 * @name History
 * @namespace
 * @memberof Frampton
 */
Frampton.History = {};
Frampton.History.pushState    = pushState;
Frampton.History.replaceState = replaceState;
Frampton.History.setHash      = setHash;
Frampton.History.depth        = depth;
Frampton.History.state        = state;
Frampton.History.hash         = hash;
Frampton.History.path         = path;
Frampton.History.search       = search;
Frampton.History.change       = change;