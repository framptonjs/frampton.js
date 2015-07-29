import supported from 'frampton-style/supported';

var eventMap = {
  'WebkitTransition' : 'webkitTransitionEnd',
  'MozTransition' : 'transitionend',
  'transition' : 'transitionend'
};

function transitionEnd() {
  return (eventMap[supported('transition')] || null);
}

export default transitionEnd();