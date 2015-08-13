import curry from 'frampton-utils/curry';

export default curry(function set_html(element, html) {
  element.innerHTML = html;
});