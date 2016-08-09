import { JustType } from 'frampton-data/maybe/create';

export default function create_just(val) {
  return new JustType(val);
}
