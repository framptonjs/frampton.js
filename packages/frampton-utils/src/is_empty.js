export default function is_empty(obj) {
  return (!obj || !obj.length || 0 === obj.length);
}