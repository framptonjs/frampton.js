import guid from 'frampton-utils/guid';
import merge from 'frampton-record/merge';
import keys from 'frampton-data/state/keys';

export default function create_state(data, id, props) {

  const _id = (id || guid());
  const _props = (props || keys(data));

  const model = function(update) {
    return create_state(merge(data, update), _id, _props);
  };

  // private
  model._id = _id;
  model._props = _props;

  // public
  for (let i = 0; i < _props.length; i++) {
    model[_props[i]] = data[_props[i]];
  }

  return Object.freeze(model);
}