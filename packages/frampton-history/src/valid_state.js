export default function valid_state(state) {
  return !!(state.name && state.path);
}