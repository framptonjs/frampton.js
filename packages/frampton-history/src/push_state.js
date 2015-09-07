import guid from 'frampton-utils/guid';
import history from 'frampton-history/get_history';
import withValidState from 'frampton-history/with_valid_state';
import { pushHistory } from 'frampton-history/history_stack';

export default withValidState(function push_state(state) {
  state.id = guid();
  pushHistory(state);
  history().pushState(state, state.name, state.path);
});