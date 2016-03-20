import curry from 'frampton-utils/curry';

export default curry((element, html) => {
  element.innerHTML = html;
});