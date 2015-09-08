import Frampton from 'frampton/namespace';
import Union from 'frampton-data/union';
import { Either, Left, Right } from 'frampton-data/either';
import { Maybe, Just, Nothing } from 'frampton-data/maybe';
import Task from 'frampton-data/task';
import when from 'frampton-data/when';
import sequence from 'frampton-data/sequence';
import runTask from 'frampton-data/run_task';
import fork from 'frampton-data/fork';
import fail from 'frampton-data/fail';
import succeed from 'frampton-data/succeed';

/**
 * @name Data
 * @namespace
 * @memberof Frampton
 */
Frampton.Data          = {};
Frampton.Data.Union    = Union;
Frampton.Data.Either   = Either;
Frampton.Data.Left     = Left;
Frampton.Data.Right    = Right;
Frampton.Data.Maybe    = Maybe;
Frampton.Data.Just     = Just;
Frampton.Data.Nothing  = Nothing;
Frampton.Data.Task     = Task;
Frampton.Data.when     = when;
Frampton.Data.sequence = sequence;
Frampton.Data.runTask  = runTask;
Frampton.Data.fork     = fork;
Frampton.Data.fail     = fail;
Frampton.Data.succeed  = succeed;