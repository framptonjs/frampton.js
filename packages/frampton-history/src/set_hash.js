import { pushState } from 'frampton-history/history_stack';

/**
 * @name setHash
 * @method
 * @memberof Frampton.History
 * @param {String} hash
 */
export default function set_hash(hash) {
  pushState({
    name : 'hash',
    path : '#' + hash
  });
}