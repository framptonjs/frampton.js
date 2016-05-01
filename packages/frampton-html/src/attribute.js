import curry from 'frampton-utils/curry';

// attribute :: String -> Dom -> String
export default curry((name, dom) => {
  return dom.getAttribute(name);
});