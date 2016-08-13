import Frampton from 'frampton/namespace';

import createTask from 'frampton-data/task/create';
import fail from 'frampton-data/task/fail';
import never from 'frampton-data/task/never';
import sequence from 'frampton-data/task/sequence';
import succeed from 'frampton-data/task/succeed';
import when from 'frampton-data/task/when';
import execute from 'frampton-data/task/execute';

import createUnion from 'frampton-data/union/create';

import createRecord from 'frampton-data/record/create';

import { create as createMaybe } from 'frampton-data/maybe/create';
import Just from 'frampton-data/maybe/just';
import Nothing from 'frampton-data/maybe/nothing';

import Success from 'frampton-data/result/success';
import Failure from 'frampton-data/result/failure';
import fromThrowable from 'frampton-data/result/from_throwable';


/**
 * @name Data
 * @namespace
 * @memberof Frampton
 */
Frampton.Data = {};

/**
 * @name Task
 * @memberof Frampton.Data
 * @class A data type for wrapping impure computations
 * @constructor Should not be called by the user.
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
 * @class
 */
Frampton.Data.Union = {};
Frampton.Data.Union.create = createUnion;

/**
 * @name Record
 * @memberof Frampton.Data
 * @class
 */
Frampton.Data.Record = {};
Frampton.Data.Record.create = createRecord;

/**
 * @name Maybe
 * @memberof Frampton.Data
 * @class
 */
Frampton.Data.Maybe = {};
Frampton.Data.Maybe.create = createMaybe;
Frampton.Data.Maybe.Just = Just;
Frampton.Data.Maybe.Nothing = Nothing;

/**
 * @name Result
 * @memberof Frampton.Data
 * @class
 */
Frampton.Data.Result = {};
Frampton.Data.Result.fromThrowable = fromThrowable;
Frampton.Data.Result.Success = Success;
Frampton.Data.Result.Failure = Failure;
