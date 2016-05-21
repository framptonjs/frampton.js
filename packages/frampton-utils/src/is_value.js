export default function is_value(test) {
  return function(val) {
    return (val === test);
  };
}
