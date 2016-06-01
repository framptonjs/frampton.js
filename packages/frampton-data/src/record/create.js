import Frampton from 'frampton/namespace';
import guid from 'frampton-utils/guid';
import warn from 'frampton-utils/warn';
import isNothing from 'frampton-utils/is_nothing';
import isSomething from 'frampton-utils/is_something';
import merge from 'frampton-record/merge';
import keys from 'frampton-record/keys';

export default function create_record(data, id, props) {

  const _id = (id || guid());
  const _props = (props || keys(data));

  const model = function(update) {
    if (isNothing(update) && Frampton.isDev()) {
      return Object.freeze(data);
    } else if (isSomething(update)) {
      return create_record(merge(data, update), _id, _props);
    }
  };

  // private
  model._id = _id;
  model._props = _props;

  // public
  for (let i = 0; i < _props.length; i++) {
    model[_props[i]] = data[_props[i]];
  }

  // In dev mode verify object properties
  if (Frampton.isDev()) {
    for (let key in data) {
      if (_props.indexOf(key) === -1) {
        warn('Frampton.Data.Record received unknown key: ' + key);
      }
    }
  }

  return Object.freeze(model);
}
