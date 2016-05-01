import Frampton from 'frampton/namespace';

import createTask from 'frampton-data/task/create';
import fail from 'frampton-data/task/fail';
import never from 'frampton-data/task/never';
import sequence from 'frampton-data/task/sequence';
import succeed from 'frampton-data/task/succeed';
import when from 'frampton-data/task/when';
import execute from 'frampton-data/task/execute';

import createUnion from 'frampton-data/union/create';

import createState from 'frampton-data/state/create';


/**
 * @name Data
 * @namespace
 * @memberof Frampton
 */
Frampton.Data = {};

/**
 * @name Task
 * @memberof Frampton.Data
 * @namespace
 */
Frampton.Data.Task          = {};
Frampton.Data.Task.create   = createTask;
Frampton.Data.Task.fail     = fail;
Frampton.Data.Task.succeed  = succeed;
Frampton.Data.Task.never    = never;
Frampton.Data.Task.sequence = sequence;
Frampton.Data.Task.when     = when;
Frampton.Data.Task.execute  = execute;

/**
 * @name Union
 * @memberof Frampton.Data
 * @namespace
 */
Frampton.Data.Union = {};
Frampton.Data.Union.create = createUnion;

/**
 * @name State
 * @memberof Frampton.Data
 * @namespace
 */
Frampton.Data.State = {};
Frampton.Data.State.create = createState;