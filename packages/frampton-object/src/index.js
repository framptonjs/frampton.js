import Frampton from 'frampton/namespace';
import filter from 'frampton-object/filter';
import reduce from 'frampton-object/reduce';
import map from 'frampton-object/map';
import merge from 'frampton-object/merge';
import forEach from 'frampton-object/for_each';
import asList from 'frampton-object/as_list';
import copy from 'frampton-object/copy';
import update from 'frampton-object/update';

/**
 * @name Record
 * @namespace
 * @memberof Frampton
 */
Frampton.Object = {};
Frampton.Object.copy   = copy;
Frampton.Object.update = update;
Frampton.Object.filter = filter;
Frampton.Object.reduce = reduce;
Frampton.Object.map    = map;
Frampton.Object.each   = forEach;
Frampton.Object.asList = asList;
Frampton.Object.merge  = merge;
