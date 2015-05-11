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

  // if (localRuntime.isEmbed()) {
  //     var rect = localRuntime.node.getBoundingClientRect();
  //     var relx = rect.left + document.body.scrollLeft + document.documentElement.scrollLeft;
  //     var rely = rect.top + document.body.scrollTop + document.documentElement.scrollTop;
  //     // TODO: figure out if there is a way to avoid rounding here
  //     posx = posx - Math.round(relx) - localRuntime.node.clientLeft;
  //     posy = posy - Math.round(rely) - localRuntime.node.clientTop;
  //   }

  return [posx, posy];
}