import { Either, Left, Right } from 'frampton-data/either';
import { Maybe, Just, Nothing } from 'frampton-data/maybe';
import Task from 'frampton-data/task';
import when from 'frampton-data/when';
import sequence from 'frampton-data/sequence';
import runTask from 'frampton-data/run_task';
import fork from 'frampton-data/fork';
import fail from 'frampton-data/fail';
import succeed from 'frampton-data/succeed';

export {
  Either,
  Left,
  Right,
  Maybe,
  Just,
  Nothing,
  Task,
  when,
  sequence,
  runTask,
  fork,
  fail,
  succeed
};