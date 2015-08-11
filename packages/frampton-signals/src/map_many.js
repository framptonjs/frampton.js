import Behavior from 'frampton-signals/behavior';

// map_many :: Function -> [Behavior] -> Behavior
export default function(mapping, ...behaviors) {
  return new Behavior(mapping(), (sink) => {
    behaviors.forEach((behavior) => {
      behavior.changes(() => sink(mapping()));
    });
  });
}