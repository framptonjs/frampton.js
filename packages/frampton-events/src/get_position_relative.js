import curry from 'frampton-utils/curry';
import getPosition from 'frampton-events/get_position';

export default curry(function get_position_relative(node, evt) {

  var position = getPosition(evt);

  var rect = node.getBoundingClientRect();
  var relx = rect.left + document.body.scrollLeft + document.documentElement.scrollLeft;
  var rely = rect.top + document.body.scrollTop + document.documentElement.scrollTop;

  var posx = position[0] - Math.round(relx) - node.clientLeft;
  var posy = position[1] - Math.round(rely) - node.clientTop;

  return [posx, posy];
});