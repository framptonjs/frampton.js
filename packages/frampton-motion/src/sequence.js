export default function sequence_transitions(...transitions) {
  return transitions.reduce((acc, next) => {
    return acc.chain(next);
  });
}