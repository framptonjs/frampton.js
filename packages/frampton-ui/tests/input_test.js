import Input from 'frampton-ui/input';

QUnit.module('Frampton.UI.Input', {
  beforeEach() {
    this.div = document.createElement('div');
    this.container = document.getElementById('qunit-fixture');
    this.container.appendChild(this.div);
  },
  afterEach() {
    this.container.removeChild(this.div);
    this.container = null;
  }
});

QUnit.test('should get the initial value of input element', function() {

  var textInput = document.createElement('input');
  textInput.value = 'test';

  Input(textInput).value.changes((val) => {
    equal(val, 'test');
  });
});

QUnit.test('should get the initial value of nested input element', function() {

  var textInput = document.createElement('input');
  textInput.value = 'test';
  this.div.appendChild(textInput);

  Input(this.div).value.changes((val) => {
    equal(val, 'test');
  });
});

QUnit.test('should get the initial value of select element', function() {

  var selectInput = document.createElement('select');
  selectInput.innerHTML = '<option value="one">One</option><option value="two">Two</option>';

  Input(selectInput).value.changes((val) => {
    equal(val, 'one');
  });
});

QUnit.test('should get the initial value of nested select element', function() {

  var selectInput = document.createElement('select');
  selectInput.innerHTML = '<option value="one">One</option><option value="two">Two</option>';
  this.div.appendChild(selectInput);

  Input(this.div).value.changes((val) => {
    equal(val, 'one');
  });
});