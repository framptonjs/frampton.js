import contains from 'frampton-string/contains';

function propValue(prop, value) {
  return (prop + '(' + value + ')');
}

export default function updateTransform(transform, prop, value) {
  var reg;
  if (contains(prop, transform)) {
    reg = new RegExp(prop + "\\([^)]*\\)");
    transform = transform.replace(reg, propValue(prop, value));
  } else {
    if (transform.length > 0) {
      transform = transform + ' ';
    }
    transform = transform + propValue(prop, value);
  }

  return transform;
}