# Frampton

Frampton is a library to assist writing JavaScript in a functional manner. Frampton supplies an observable implementation (Frampton.Signal). Frampton is inspired largely by the Elm community thus we use similar naming conventions (Signal vs EventStream). Frampton also provides a number of utilities for dealing with common JavaScript types in a more functional manner.

### Currying

Almost all functions exported by Frampton are curried. If a function takes more than one argument it can be partially applied to create a new function that waits on the remaining arguments.


## Frampton.Signal

A Signal is a value that changes over time. Signals provide methods to alter their values or to be alerted to the changing state of those values.

```
const Signal = Frampton.Signal.create;

// create a new signal
const sig = Signal();

// create a signal with an initial value
const sig2 = Signal(5);

// Respond to values of the signal
// the value method will immediately log '5' and then log any updates
// to the signal
sig2.value((val) => {
  console.log('value = ' + val);
});

// the next method will not log 5, it will wait for the next value and update
// on each value after.
sig2.next((val) => {
  console.log('next = ' + val);
});

// the changes method works like the value method except it filters out repeated
// values. It will log 5 and then wait for the next value on the signal that is
// not a 5.
sig2.changes((val) => {
  console.log('changes = ' + val);
});

// Push a new value onto a signal
sig2.push(6);

// Get the current value of a signal
sig2.get();

// Modify a signal
// All methods return new signals
// Filter values
const greaterThanFive = sig2.filter((val) => val > 5);

// You can also compare the current value against the next to decide if you want
// the signal to update. How changes is implemented
const changes = sig2.filterPrevious((prevValue, nextValue) => {
  return prevValue !== nextValue;
});

// Map values
const plusOne = sig2.map((val) => val + 1);

// Filter with another signal.
// This signal will only continue if sig has a truthy value.
const conditionMet = sig2.and(sig);

// This signal will only continue if sig has a falsy value.
const notCondition = sig2.not(sig);

// When sig2 updates this signal will grab the value of sig
const replace = sig2.sample(sig);

// Merge signals
const bothSignals = sig2.merge(sig);

// Zip signals. The resulting signal's value will be a tuple of the current
// values of each of its parents'
const tupleSignal = sig2.zip(sig);

// Reduce a signal with a function. Like Array.prototype.reduce
// This counts how many times sig2 is called
const counter = sig2.fold((acc, next) => {
  return acc + 1;
}, 0);

```


## Frampton.Events

Events are central to any browser application. This module provides a number of functions to make dealing with events easier.

```
const Events = Frampton.Events;

// Create a signal from DOM events
// These events are attached to the document element.
const clicks = Events.onEvent('click');
const inputs = Events.onEvent('input');

// Create a signal from DOM events scoped to a given element.
// These events are also attached to the document, but are filtered based on
// the event target. All DOM events handled by Frampton are delegated. Most
// are delegated off of the document. No mater how many clicks you listen for
// in your code only one listener for click is ever attached to the DOM.
const divClicks = Events.onEvent('click', document.querySelector('div'));

// Listen for clicks on elements with a given selector
// Again event listeners are attached to the document and delegated.
const itemClicks = Events.onSelector('click', '.list-item');

// Get signal of event targets
const eventTargets = clicks.map(Events.eventTarget);

// Get the value of event targets (event.target.value)
const eventValues = inputs.map(Events.eventValue);

// Does the target of the event have a given selector
const matchingTargets = clicks.filter(Events.hasSelector('.test'));

// Is the target of the event inside an element with the given selector
const containedIn = clicks.filter(Events.selectorContains('.test'));

// Does the target of the event contain an element with the given selector
const doesContain = clicks.filter(Events.containsSelector('.test'));

// Does the target of the event contain a given element
const node = document.querySelector('div');
const doesContainElement = clicks.filter(Events.contains(node));

// Get the position of an event as a tuple [x,y]
const position = clicks.map(Events.getPosition);

// Get the position of an event relative to a node
const node = document.querySelector('div');
const relativePostion = clicks.map(Events.getPositionRelative(node));
```


## Frampton.Data

Frampton.Data module exposes a few abstract data types that make working functionally a little easier.

### Frampton.Data.Maybe

A Maybe is used to represent a value that may be null or undefined. This gives you an interface for dealing with such values without having to constantly do null checks.

In Frampton Maybes are essentially abstract classes that have two subclass Just and Nothing. Here we're using Haskell naming conventions. A Just represents a value and a Nothing is a missing value.

```
const Maybe = Frampton.Data.Maybe.create;

const maybeOne = Maybe(1); // -> 'Just(1)'
const maybeNothing = Maybe(null); // -> 'Nothing'

// change the value of a Maybe
const mapping = (val) => val + 2;
const updatedOne = maybeOne.map(mapping); // -> 'Just(3)'
const updatedNothing = maybeNothing.map(mapping); // 'Nothing'

// filter the value of a Maybe
const predicate = (val) => val > 2;
const filteredOne = maybeOne.filter(predicate); // -> 'Nothing'
const filteredUpdatedOne = updatedOne.filter(predicate); // -> 'Just(3)'
const filteredNothing = updatedNothing.filter(predicate); // -> 'Nothing'

// flatten a nested Maybe
const nested = Maybe(Mabye(5)); // -> 'Just(Just(5))'
cosnt flattened = nested.join(); // -> 'Just(5)'

// join only removes one level of nesting
const doubleNested = Maybe(Maybe(Mabye(5))); // -> 'Just(Just(Just(5)))'
cosnt doubleFlattened = doubleNested.join(); // -> 'Just(Just(5))'

// get the value from a Maybe
const one = maybeOne.get(); // -> 1
const nothing = maybeNothing.get(); // -> Error: can't get value of Nothing

// safely get the value of a Maybe
const safeOne = maybeOne.getOrElse(5); // -> 1
const safeNothing = maybeNothing.getOrElse(5); // -> 5
```

### Frampton.Data.Record

Records in functional languages are often types that are similar to object literals in JavaScript. The difference is they are immutable and updating a key returns a new Record with the updated key/value.

Frampton provides a simple type that gives you an immutable object that when updated returns a new object.

```
const Record = Frampton.Data.Record.create;

const bob = Record({
  name : 'Bob',
  age : 32
});

// Records are immutable
bob.age = 40;
console.log(bob.age); // -> 32

const olderBob = bob.update({ age : 40});
console.log(olderBob.age); // -> 40
console.log(bob.age); // -> 32

// You can't add keys during an update
// In dev mode a warning is logged when trying to add keys during update
const jim = bob.update({ name : 'Jim', eyes : 'blue' });
console.log(jim.eyes); // -> undefined
console.log(jim.name); // -> 'Jim'

// Get an object literal representation of the Record
const data = bob.data(); // -> { name : 'Bob', age : 32 }
```

### Frampton.Data.Task

A Task is essentially an IO monad. Use it to wrap IO operations that may fail. Tasks are particularly good for wrapping async operations. Much like promises.

Tasks are lazy. A task can be described without being run.

```
const Task = Frampton.Data.Task.create;

// A task takes a function to run. When the function is run it will receive
// an object with callbacks for different events in the life of the task.
const waitTwoSeconds = Task((sinks) => {
  setTimeout(() => {
    sinks.resolve('2 seconds passes');
  }, 2000);
});

// This just describes the task. To run it...
waitTwoSeconds.run({
  resolve : (msg) => console.log(msg),
  reject : (err) => console.log('err: ', err)
});

// To filter the results of a task (a resolve becomes a reject)
const random = Task((sinks) => {
  sinks.resolve(Math.random() * 100);
});

const randomOverFifty = random.filter((val) => val > 50);

// To map a result to another value...
// After 2 seconds emits a 5.
const delayedFive = waitTwoSeconds.map(5);

// Map can also take a function
const delayedFunc = waitTwoSeconds.map((msg) => {
  return msg.toUpperCase();
});

// To recover from an error. A reject becomes a resolve.
const httpGet = (url) => {
  return Task((sinks) => {
    $.get(url).then((res) => {
      sinks.resolve(res);
    }, (err) => {
      sinks.reject(err);
    });
  });
});

const neverFailRequest = httpGet('http://fake.com/api/posts').recover((err) => {
  // on failure return an empty array.
  return [];
});

// Or, just supply a default value for failure
const neverFailRequest = httpGet('http://fake.com/api/posts').default([]);

// Run tasks in parallel...
Frampton.Data.Task.when(/* tasks to run */).run(...);

// Run tasks in sequence...
Frampton.Data.Task.sequence(/* tasks to run */).run(...);

```


## Frampton.Style

Frampton.Style exports functions for dealing with CSS styles and classes.

```
const Style = Frampton.Style;

// Does an element match a selector
const node = document.querySelector('div');
const isButton = Style.matches('button'); // curried funciton
isButton(node); // -> false

// Get the element closest parent of this node that matches the given selector
const node = document.querySelector('.test');
const matchingNode = Style.closest('.test-parent', node);

// Does the element or one of its children match the selector
const node = document.querySelector('.test');
const doesMatch = Style.contains('.test-child');
```

## Frampton.Utils

Frampton.Utils exports a host of utility functions. Here are a few.

```
const Utils = Frampton.Utils;

// Curry a function
function add(a, b) {
  return a + b;
}

const curriedAdd = Utils.curry(add);
const addOne = curriedAdd(1);
addOne(3); // -> 4
addOne(5); // -> 6


// Compose functions
const addFour = curriedAdd(4);
const addFive = Utils.compose(addFour, addOne);
addFive(5); // -> 10

// Identity function
Utils.identity(5); // -> 5

// Get a property from an Object
const obj = {
  one : 1,
  two : 2,
  sub : {
    three : 3,
    four : 4
  }
};

Utils.get('one', obj); // -> 1
Utils.get('sub.four', obj); // -> 4
Utils.get('sub.five', obj); // -> null

// Boolean tests
Utils.isArray({}); // -> false
Utils.isObject([]); // -> false
Utils.isString('test'); // -> true
Utils.isBoolean(false); // -> true
Utils.isDefined(undefined); // -> false
Utils.isUndefined(undefined); // -> true
Utils.isNull(null); // -> true
Utils.isEmpty([]); // -> true
Utils.isEmpty(''); // -> true
Utils.isTrue(true); // -> true
Utils.isFalse(false); // -> true
Utils.isFunction(() => {}); // -> true;
Utils.isNothing(null); // -> true
Utils.isNothing(undefined); // -> true
Utils.isSomething(null); // -> false
Utils.isSomething(undefined); // -> false
const isFive = Utils.isValue(5);
isFive(5); // -> true

// A function that always returns the given values
const fives = Utils.ofValue(5);
fives(); // -> 5
fives(7); // -> 5
```
