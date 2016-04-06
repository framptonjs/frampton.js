import create from 'frampton-data/task/create';

//+ when :: [Task x a] -> Task x [a]
export default function when(...tasks) {

  return create((_, resolve) => {

    const valueArray = new Array(tasks.length);
    const errorArray = [];
    const len = tasks.length;
    var idx = 0;
    var count = 0;

    function logError(err) {
      errorArray.push(err);
    }

    tasks.forEach((task) => {
      const index = idx++;
      task.run(logError, (val) => {
        count = count + 1;
        valueArray[index] = val;
        if (count === len) {
          resolve(valueArray);
        }
      });
    });
  });
}