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
  const rel_x = rect.left + document.body.scrollLeft + document.documentElement.scrollLeft;
  const rel_y = rect.top + document.body.scrollTop + document.documentElement.scrollTop;

  const pos_x = position[0] - Math.round(rel_x) - node.clientLeft;
  const pos_y = position[1] - Math.round(rel_y) - node.clientTop;

  return [pos_x, pos_y];
});