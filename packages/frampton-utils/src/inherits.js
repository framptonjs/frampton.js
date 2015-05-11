/**
 * Similar to class extension in other languages. The child recieves all the
 * static and prototype methods/properties of the parent object.
 */
export default function inherits(child, parent) {

  for (var key in parent) {
    if (parent.hasOwnProperty(key)) {
      child[key] = parent[key];
    }
  }

  function Class() {
    this.constructor = child;
  }

  Class.prototype = parent.prototype;
  child.prototype = new Class();
  child.__super__ = parent.prototype;

  return child;
}