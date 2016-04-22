import create from 'frampton-data/task/create';

//+ when :: [Task x a] -> Task x [a]
export default function when(...tasks) {

  return create((sinks) => {

    const valueArray = new Array(tasks.length);
    const len = tasks.length;
    var idx = 0;
    var count = 0;

    function logError(err) {}
    function logProgress(val) {}

    tasks.forEach((task) => {
      const index = idx++;
      task.run({
        reject : logError,
        resolve : (val) => {
          count = count + 1;
          valueArray[index] = val;
          if (count === len) {
            sinks.resolve(valueArray);
          }
        },
        progress : logProgress
      });
    });
  });
}