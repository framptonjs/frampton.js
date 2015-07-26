import curry from 'frampton-utils/curry';
import post from 'frampton-http/post';

export default curry(function upload(url, ...files) {

  var formData = new FormData();
  var len = files.length;

  for (let i = 0; i < len; i++) {
    formData.append('file-' + i, files[i]);
  }

  return post(url, formData);
});