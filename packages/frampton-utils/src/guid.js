var id = 0;

export default function guid() {
  id += 1;
  return 'fr-id-' + id;
}
