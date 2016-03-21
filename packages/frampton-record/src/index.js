import Frampton from 'frampton/namespace';
import filter from 'frampton-record/filter';
import reduce from 'frampton-record/reduce';
import map from 'frampton-record/map';
import merge from 'frampton-record/merge';
import forEach from 'frampton-record/for_each';
import asList from 'frampton-record/as_list';
import copy from 'frampton-record/copy';
import update from 'frampton-record/update';

/**
 * @name Record
 * @namespace
 * @memberof Frampton
 */
Frampton.Record = {};
Frampton.Record.copy   = copy;
Frampton.Record.update = update;
Frampton.Record.filter = filter;
Frampton.Record.reduce = reduce;
Frampton.Record.map    = map;
Frampton.Record.each   = forEach;
Frampton.Record.asList = asList;
Frampton.Record.merge  = merge;