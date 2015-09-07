import last from 'frampton-list/last';
import depth from 'frampton-history/depth';

var stack = {
  current : 0,
  store : []
};

function push(state) {
  stack.store.push(state);
  stack.current = state.id;
  depth().update(stack.store.length);
}

function replace(state) {
  stack.current = state.id;
}

function pop() {
  stack.store.pop();
  stack.current = (last(stack.store) ? last(stack.store).id : 0);
  depth().update(stack.store.length);
}

export {
  stack as stack,
  pop as popHistory,
  push as pushHistory,
  replace as replaceHistory
};