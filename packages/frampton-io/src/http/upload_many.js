import curry from 'frampton-utils/curry';
import post from 'frampton-io/http/post';

export default curry(function upload(url, files) {
  var formData = new FormData();
  for (let i=0;i<files.length;i++) {
    formData.append('file-' + i, files[i]);
  }
  return post(url, formData);
});