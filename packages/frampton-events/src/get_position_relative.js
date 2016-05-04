import curry from 'frampton-utils/curry';
import getPosition from 'frampton-events/get_position';

/**
 * getPositionRelative :: DomNode -> DomEvent -> [Number, Number]
 *
 * @name getPositionRelative
 * @memberof Frampton.Events
 * @static
 * @param {Object} node
 * @param {Object} evt
 * @returns {Array} A pair where the 0 index is the x coord and the 1 index is the y coord
 */
export default curry(function get_position_relative(node, evt) {

  const position = getPosition(evt);

  const rect = node.getBoundingClientRect();
  const relx = rect.left + document.body.scrollLeft + document.documentElement.scrollLeft;
  const rely = rect.top + document.body.scrollTop + document.documentElement.scrollTop;

  const posx = position[0] - Math.round(relx) - node.clientLeft;
  const posy = position[1] - Math.round(rely) - node.clientTop;

  return [posx, posy];
});