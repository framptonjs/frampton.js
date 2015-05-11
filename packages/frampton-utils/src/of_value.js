export default function of_value(value) {
  return function() {
    return value;
  };
}