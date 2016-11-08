import Frampton from 'frampton/namespace';
import guid from 'frampton-utils/guid';
import warn from 'frampton-utils/warn';
import merge from 'frampton-object/merge';
import keys from 'frampton-object/keys';
import mapObj from 'frampton-object/map';
import reduceObj from 'frampton-object/reduce';

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

function makeRecord(data, id, props) {

  const model = {};
  model.ctor =  'Frampton.Data.Record';

  // private
  model._id = id;
  model._props = props;

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
    return Object.freeze(props);
  };

  /**
   * @name update
   * @memberof Frampton.Data.Record#
   * @param {Object} update
   * @returns {Object}
   */
  model.update = (update) => {
    // In dev mode verify object properties
    validateData(props, update);
    return create_record(merge(data, update), id, props);
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
    return model.update(update);
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
    return create_record(merge(data, update), id, props);
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



  for (let i = 0; i < props.length; i++) {
    const key = props[i];
    const value = data[key];
    if (blacklist.indexOf(key) === -1) {
      model[key] = value;
    } else {
      warn(`Frampton.Data.Record received a protected key: ${key}`);
    }
  }

  return Object.freeze(model);
}

export default function create_record(data) {
  return makeRecord(data, guid(), keys(data));
}
