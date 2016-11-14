import Frampton from 'frampton/namespace';
import asList from 'frampton-object/as_list';
import copy from 'frampton-object/copy';
import filter from 'frampton-object/filter';
import forEach from 'frampton-object/for_each';
import get from 'frampton-object/get';
import keys from 'frampton-object/keys';
import map from 'frampton-object/map';
import merge from 'frampton-object/merge';
import reduce from 'frampton-object/reduce';
import set from 'frampton-object/set';
import update from 'frampton-object/update';
import values from 'frampton-object/values';

/**
 * @name Object
 * @namespace
 * @memberof Frampton
 */
Frampton.Object = {};
Frampton.Object.asList = asList;
Frampton.Object.copy   = copy;
Frampton.Object.each   = forEach;
Frampton.Object.filter = filter;
Frampton.Object.get    = get;
Frampton.Object.keys   = keys;
Frampton.Object.map    = map;
Frampton.Object.merge  = merge;
Frampton.Object.reduce = reduce;
Frampton.Object.set    = set;
Frampton.Object.update = update;
Frampton.Object.values = values;
