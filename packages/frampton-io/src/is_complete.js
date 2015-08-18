//+ is_complete :: Response -> Boolean
export default function is_complete(response) {
  return (response && response.status === 'complete');
}