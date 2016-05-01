import prepend from 'frampton-list/prepend';
import first from 'frampton-list/first';
import second from 'frampton-list/second';
import execute from 'frampton-data/task/execute';
import create from 'frampton-signal/create';
import { mergeMany } from 'frampton-signal/create';

export default function start(config) {

  function update(acc, next) {
    const model = acc[0];
    return config.update(next, model);
  }

  const messages = create();
  const initialState = config.init();
  const inputs = mergeMany(prepend(config.inputs, messages));
  const stateAndTasks = inputs.fold(update, initialState);
  const state = stateAndTasks.map(first);
  const tasks = stateAndTasks.map(second);

  // Run tasks and publish any resulting actions back into messages
  execute(tasks, messages, messages);

  return state;
}