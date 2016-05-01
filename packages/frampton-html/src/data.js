import curry from 'frampton-utils/curry';
import attribute from 'frampton-html/attribute';

// data :: String -> Dom -> String
export default curry((name, dom) => {
  return attribute(('data-' + name), dom);
});