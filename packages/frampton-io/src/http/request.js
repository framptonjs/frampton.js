export default function Request(url, method, data, headers) {
  return {
    url     : url,
    method  : (method || 'GET'),
    body    : (data || null),
    headers : (headers || {})
  };
}