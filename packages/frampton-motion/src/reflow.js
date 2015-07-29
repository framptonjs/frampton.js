// Reading the offsetWidth of an element will force the browser to do a reflow
export default function reflow(element) {
  return element.offsetWidth;
}