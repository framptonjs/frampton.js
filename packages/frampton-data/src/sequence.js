//+ sequence :: [Task x a] -> Task x a
export default function sequence(...tasks) {
  return tasks.reduce((acc, next) => {
    acc.concat(next);
  });
}