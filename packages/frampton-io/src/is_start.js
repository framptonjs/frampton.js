//+ is_start :: Response -> Boolean
export default function is_start(response) {
  return (response && response.status === 'start');
}