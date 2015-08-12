/**
 * getPosition :: DomEvent -> [Number, Number]
 *
 * @name getPosition
 * @memberOf Frampton.Events
 * @static
 * @param {Object} evt
 * @returns {Array} A pair where the 0 index is the x coord and the 1 index is the y coord
 */
export default function get_position(evt) {

  var posx = 0;
  var posy = 0;
  var body = document.body;
  var documentElement = document.documentElement;

  if (evt.pageX || evt.pageY) {
    posx = evt.pageX;
    posy = evt.pageY;
  } else if (evt.clientX || evt.clientY) {
    posx = evt.clientX + body.scrollLeft + documentElement.scrollLeft;
    posy = evt.clientY + body.scrollTop + documentElement.scrollTop;
  }

  return [posx, posy];
}