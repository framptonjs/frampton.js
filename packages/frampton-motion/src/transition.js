import assert from 'frampton-utils/assert';
import isSomething from 'frampton-utils/is_something';
import isString from 'frampton-utils/is_string';
import guid from 'frampton-utils/guid';
import noop from 'frampton-utils/noop';
import notImplemented from 'frampton-utils/not_implemented';
import add from 'frampton-list/add';
import remove from 'frampton-list/remove';
import reverse from 'frampton-list/reverse';
import setStyle from 'frampton-style/set_style';
import addClass from 'frampton-style/add_class';
import removeClass from 'frampton-style/remove_class';
import { addListener } from 'frampton-events/event_dispatcher';
import transitionend from 'frampton-motion/transition_end';
import reflow from 'frampton-motion/reflow';
import setDirection from 'frampton-motion/set_direction';
import setState from 'frampton-motion/set_state';
import inverseDirection from 'frampton-motion/inverse_direction';

function defaultRun(resolve) {

  reflow(this.element);
  this.element.setAttribute('data-transition-id', this.id);

  var unsub = addListener(transitionend, (evt) => {
    if (parseInt(evt.target.getAttribute('data-transition-id')) === this.id) {
      unsub();
      setState(this, Transition.CLEANUP);
      if (this.delayTime) {
        setStyle(this.element, 'transition-delay', (0 + 'ms'));
      }
      reflow(this.element);
      setState(this, Transition.DONE);
      (resolve || noop)(this.element);
    }
  }, this.element);

  setDirection(this, this.direction);

  if (this.delayTime) {
    setStyle(this.element, 'transition-delay', (this.delayTime + 'ms'));
  }

  if (this.direction === 'transition-in') {
    this.classList.forEach(addClass(this.element));
  } else {
    this.classList.forEach(removeClass(this.element));
  }

  setState(this, Transition.RUNNING);
}

function withDefaultRun(element, frame, dir) {
  var trans = new Transition(element, frame, dir);
  trans.run = defaultRun;
  return trans;
}

function Transition(element, frame, dir) {

  assert('Browser does not support CSS transitions', isSomething(transitionend));

  this.id        = guid();
  this.element   = (element || null);
  this.direction = (dir || 'transition-in');
  this.classList = (isString(frame) ? frame.trim().split(' ') : []);
  this.state     = Transition.WAITING;
  this.delayTime = 0;
  this.list      = [this];

  setState(this, this.state);
}

/**
 * Start the transition. Optionally provide a callback for when transition is complete.
 *
 * @name run
 * @memberOf Frampton.Motion.Transition
 * @instance
 * @param {Function} resolve Function to call when transition is complete.
 */
Transition.prototype.run = notImplemented;

/**
 * @name delay
 * @memberOf Frampton.Motion.Transition
 * @instance
 * @param {Number} delay Miliseconds to delay transition
 * @returns {Transition}
 */
Transition.prototype.delay = function Transition_delay(delay) {
  this.delayTime = delay;
  return this;
};

/**
 * @name addClass
 * @memberOf Frampton.Motion.Transition
 * @instance
 * @param {String} name Name of class to add
 * @returns {Transition}
 */
Transition.prototype.addClass = function Transition_addClass(name) {
  return withDefaultRun(
    this.element,
    add(this.classList, name),
    this.direction
  );
};

/**
 * @name removeClass
 * @memberOf Frampton.Motion.Transition
 * @instance
 * @param {String} name Name of class to remove
 * @returns {Transition}
 */
Transition.prototype.removeClass = function Transition_removeClass(name) {
  return withDefaultRun(
    this.element,
    remove(this.classList, name),
    this.direction
  );
};

/**
 * @name reverse
 * @memberOf Frampton.Motion.Transition
 * @instance
 * @returns {Transition}
 */
Transition.prototype.reverse = function Transition_reverse() {
  return withDefaultRun(
    this.element,
    this.classList.join(' '),
    inverseDirection(this.direction)
  );
};

/**
 * @name reverse
 * @memberOf Frampton.Motion.Transition
 * @instance
 * @param {Transition} transition Transition to run after this transition.
 * @returns {Transition}
 */
Transition.prototype.chain = function Transition_chain(transition) {

  var trans = new Transition();
  var saved = this.run.bind(this);

  trans.list = add(this.list, transition);

  trans.run = function chain_run(resolve) {
    saved(() => {
      transition.run(resolve);
    });
  };

  trans.reverse = function chain_reverse() {
    var list = reverse(trans.list);
    var len = list.length;
    var i   = 1;
    var temp = list[0].reverse();
    for (;i<len;i++) {
      temp = temp.chain(list[i].reverse());
    }
    return temp;
  };

  return trans;
};

Transition.WAITING = 'waiting';
Transition.STARTED = 'started';
Transition.RUNNING = 'running';
Transition.DONE    = 'done';
Transition.CLEANUP = 'cleanup';

function transitionClass(element, frame) {
  return withDefaultRun(element, frame);
}

export {
  Transition,
  transitionClass as transition
};