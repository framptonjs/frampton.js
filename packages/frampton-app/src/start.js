import prepend from 'frampton-list/prepend';
import second from 'frampton-list/second';
import execute from 'frampton-data/task/execute';
import create from 'frampton-signal/create';
import { mergeMany } from 'frampton-signal/create';

// default actions log_error, log_message, log_warning

export default function start(config) {

  function update(acc, next) {
    const model = acc[0];
    return config.update(next, model);
  }

  const messages = create();
  const initialModel = config.init();
  const inputs = mergeMany(prepend(config.inputs, messages));
  const modelAndTasks = inputs.fold(update, initialModel);
  const tasks = modelAndTasks.map(second);

  // Run tasks and publish any resulting actions back into messages
  execute(messages, tasks);
}