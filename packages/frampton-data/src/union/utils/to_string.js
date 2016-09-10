export default function to_string() {
  const value = this._values.join(',');
  return `Union.${this.ctor}(${value})`;
}
