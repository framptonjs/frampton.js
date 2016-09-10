const blacklist =
  ['ctor', 'children', 'caseOf', 'match'];

export default function validate_types(types) {
  const len = types.length;
  for (let i = 0; i < len; i++) {
    let name = types[i];
    if (blacklist.indexOf(name) !== -1) {
      throw new Error(
        `Frampton.Data.Union received a protected key: ${name}`
      );
    }
  }
}
