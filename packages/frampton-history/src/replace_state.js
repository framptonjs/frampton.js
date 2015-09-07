import guid from 'frampton-utils/guid';
import history from 'frampton-history/get_history';
import withValidState from 'frampton-history/with_valid_state';
import { replaceHistory } from 'frampton-history/history_stack';

export default withValidState(function replace_state(state) {
  state.id = guid();
  replaceHistory(state);
  history().replaceState(state, state.name, state.path);
});