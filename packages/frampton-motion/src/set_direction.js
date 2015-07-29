import inverseDirection from 'frampton-motion/inverse_direction';

export default function set_direction(transition, dir) {
  if (transition.element) {
    transition.element.classList.remove(inverseDirection(dir));
    transition.element.classList.add(dir);
  }
  transition.direction = dir;
}