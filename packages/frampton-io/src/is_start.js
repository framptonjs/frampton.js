//+ is_start :: Response -> Boolean
export default function is_start(response) {
  return (response.status === 'start');
}