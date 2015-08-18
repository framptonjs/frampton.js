//+ is_error :: Response -> Boolean
export default function is_error(response) {
  return (response && response.status === 'error');
}