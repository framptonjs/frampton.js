// immediate :: Function -> ()
export default function immediate(fn, context) {
  setTimeout(fn.bind(context || null), 0);
}