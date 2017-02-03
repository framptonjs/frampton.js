import createTask from 'frampton-data/task/create';

export default function batch(...list) {
  return createTask((sinks) => {
    const len = list.length;
    for (let i = 0; i < len; i++) {
      list[i].run(sinks);
    }
  });
}