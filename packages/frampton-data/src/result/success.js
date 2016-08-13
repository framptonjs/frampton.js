import { SuccessType } from 'frampton-data/result/result';

export default function success(val) {
  return new SuccessType(val);
}
