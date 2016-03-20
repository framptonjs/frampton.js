import curry from 'frampton-utils/curry';

// data :: String -> Dom -> String
export default curry((name, dom) => {
  return dom.getAttribute('data-' + name);
});