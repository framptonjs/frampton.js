export default function forward(signal, mapping) {
  return function(val) {
    signal(mapping(val));
  };
}