import { FailureType } from 'frampton-data/result/result';

export default function failure(err) {
  return new FailureType(err);
}
