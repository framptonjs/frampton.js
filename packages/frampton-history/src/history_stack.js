import last from 'frampton-list/last';
import depth from 'frampton-history/depth';
import stackStream from 'frampton-history/stack_stream';

var stack = {
  current : 0,
  store : []
};

var pushHistory = function push_state(newState) {
  stack.store.push(newState);
  stack.current = newState.id;
  depth().update(stack.store.length);
  stackStream().pushNext(null);
};

var replaceHistory = function replace_state(newState) {
  stack.current = newState.id;
  stackStream().pushNext(null);
};

var popHistory = function pop_history() {
  stack.store.pop();
  stack.current = ((stack.store.length > 0) ? last(stack.store).id : 0);
  depth().update(stack.store.length);
  stackStream().pushNext(null);
};

export {
  stack,
  pushHistory,
  replaceHistory,
  popHistory
};