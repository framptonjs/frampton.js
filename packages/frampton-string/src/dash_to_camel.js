export default function dash_to_camel(str) {
  return str.replace(/-([a-z])/g, function(m,w) {
    return w.toUpperCase();
  });
}