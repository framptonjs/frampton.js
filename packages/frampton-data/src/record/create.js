import Frampton from 'frampton/namespace';
import guid from 'frampton-utils/guid';
import warn from 'frampton-utils/warn';
import isObject from 'frampton-utils/is_object';
import merge from 'frampton-record/merge';
import keys from 'frampton-record/keys';

const blacklist =
  ['_id', '_props', 'ctor', 'keys', 'get', 'set', 'update', 'data'];

function validateData(props, data) {
  if (!Frampton.isProd()) {
    for (let prop in data) {
      if (props.indexOf(prop) === -1) {
        throw new TypeError(`Frampton.Data.Record received unknown key: ${prop}`);
      }
    }
  }
}

export default function create_record(data, id, props) {

  const _id = (id || guid());
  const _props = (props || keys(data));

  const model = {};
  model.ctor =  'Frampton.Data.Record';

  /**
   * @name data
   * @memberof Frampton.Data.Record
   * @returns {Object}
   */
  model.data = () => {
    return Object.freeze(data);
  };

  /**
   * @name update
   * @memberof Frampton.Data.Record
   * @param {Object} update
   * @returns {Object}
   */
  model.update = (update) => {
    if (isObject(update)) {
      return create_record(merge(data, update), _id, _props);
    } else {
      warn('Frampton.Data.Record.update did not receive an object');
    }
  };

  // private
  model._id = _id;
  model._props = _props;

  // public
  for (let i = 0; i < _props.length; i++) {
    const key = _props[i];
    const value = data[key];
    if (blacklist.indexOf(key) === -1) {
      model[key] = value;
    } else {
      warn(`Frampton.Data.Record received a protected key: ${key}`);
    }
  }

  // In dev mode verify object properties
  validateData(_props, data);

  return Object.freeze(model);
}
