export default function Response(status, progress, data) {
  return {
    status   : status,
    progress : (progress || 0),
    complete : (progress === 1),
    data     : (data || null)
  };
}