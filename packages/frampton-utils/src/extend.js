import foldl from 'frampton-list/foldl';

export default function extend(base, ...args) {
  return foldl(function(acc, next) {
    var key;
    for (key in next) {
      acc[key] = next[key];
    }
    return acc;
  }, base, args);
}