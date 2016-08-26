import Frampton from 'frampton/namespace';
import guid from 'frampton-utils/guid';
import warn from 'frampton-utils/warn';
import merge from 'frampton-record/merge';
import keys from 'frampton-record/keys';
import mapObj from 'frampton-record/map';
import reduceObj from 'frampton-record/reduce';

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
   * @memberof Frampton.Data.Record#
   * @returns {Object}
   */
  model.data = () => {
    return Object.freeze(data);
  };

  /**
   * @name keys
   * @memberof Frampton.Data.Record#
   * @returns {Array}
   */
  model.keys = () => {
    return Object.freeze(_props);
  };

  /**
   * @name update
   * @memberof Frampton.Data.Record#
   * @param {Object} update
   * @returns {Object}
   */
  model.update = (update) => {
    // In dev mode verify object properties
    validateData(_props, update);
    return create_record(merge(data, update), _id, _props);
  };

  /**
   * @name set
   * @memberof Frampton.Data.Record#
   * @param {String} key
   * @param {*} value
   * @returns {Frampont.Data.Record}
   */
  model.set = (key, value) => {
    const update = {};
    update[key] = value;
    // In dev mode verify object properties
    validateData(_props, update);
    return create_record(merge(data, update), _id, _props);
  };

  /**
   * @name map
   * @memberof Frampton.Data.Record#
   * @method
   * @param {Function} mapping
   * @returns {Frampton.Data.Record}
   */
  model.map = (mapping) => {
    const update = mapObj(mapping, data);
    return create_record(merge(data, update), _id, _props);
  };

  /**
   * @name reduce
   * @memberof Frampton.Data.Record#
   * @method
   * @param {Function} mapping
   * @param {*} initial
   * @returns {Frampton.Data.Record}
   */
  model.reduce = (mapping, initial) => {
    return reduceObj(mapping, initial, data);
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

  return Object.freeze(model);
}
