export default function remove(element) {
  const parent = element.parentNode;
  parent.removeChild(element);
}
