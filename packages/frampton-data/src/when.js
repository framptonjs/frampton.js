import Task from 'frampton-data/task';

//+ when :: [Task x a] -> Task x [a]
export default function when(...tasks) {

  return new Task((reject, resolve) => {

    var valueArray = new Array(tasks.length);
    var errorArray = [];
    var len = tasks.length;
    var idx = 0;
    var count = 0;

    function logError(err) {
      errorArray.push(err);
    }

    tasks.forEach((task) => {
      var index = idx++;
      task.run(logError, (val) => {
        count = count + 1;
        valueArray[index] = val;
        if (count === len) {
          resolve.apply(null, valueArray);
        }
      });
    });
  });
}