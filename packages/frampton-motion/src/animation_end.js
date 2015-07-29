import supported from 'frampton-style/supported';

var eventMap = {
  'WebkitAnimation': 'webkitAnimationEnd',
  'MozAnimation': 'animationend',
  'animation': 'animationend'
};

function animationEnd() {
  return (eventMap[supported('animation')] || null);
}

export default animationEnd();