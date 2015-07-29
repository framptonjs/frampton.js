export default function set_state(transition, state) {
  if (transition.element) {
    transition.element.classList.remove('transition-' + transition.state);
    transition.element.classList.add('transition-' + state);
    transition.element.setAttribute('data-transition-state', state);
  }
  transition.state = state;
}