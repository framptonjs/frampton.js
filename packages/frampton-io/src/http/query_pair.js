import queryEscape from 'frampton-io/http/query_escape';

// query_pair :: [String, String] -> String
export default function(pair) {
  return (queryEscape(pair[0]) + '=' + queryEscape(pair[1]));
}