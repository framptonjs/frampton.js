import runTask from 'frampton-data/run_task';

//+ fork
export default function fork(tasks, values, errors) {
  return tasks.next((task) => {
    runTask(task, values.push, errors.push);
  });
}