# Frampton

Frampton is a functional library written for ES5. Older browsers will require a shim.

Frampton is written with the opinion that reactive programming is best suited for modeling the user interactions we deal with in the browser. As such it provides an EventStream implementation that should be familiar to anyone who has experience with Bacon or RxJS.


## Events vs Values

Like Reactive Banana for Haskell, Frampton differentiates between a stream of events and a value that changes over time. Events are discrete and essentially stateless. The statelessness is not strictly enforced, but should be treated as such in client code. EventStreams model the discrete moments in time when an event occurs as an array of one value [a]. However, a time-varying value is modeled as a function of time t -> a, current time produces current value. In implementation current time is implicit and value will always produce the current value.


### EventStreams

EventStreams are most often going to be created my one of the many utility functions provided by the library. There are functions to produce streams for ajax operations, dom events and file handling.

```
// For example, the following code creates a stream of click events on a div.
var div = document.getElementById('my-id');
var stream = listen('click', div);

// handle clicks on the div
stream.next((evt) => {
  console.log('event: ', evt);
});
```

The listen utility handles event delegation. What this code does for you is it gets an EventStream of all clicks on the document and filters that stream based on the element you pass it, the div with the class 'my-id'.


### Behaviors

Behaviors represent time-varying values. The most common way for a Behavior to be created is with a utility called stepper. Stepper takes an initial value for the Behavior and an EventStream to update the value of the Behavior. This is how we maintain the state of an EventStream.

```
// eventValue is a utility for getting the value property of an event.target
var input = document.getElementsByTagName('input')[0];
var valueStream = listen('keyup', input).map(eventValue);

// creates a Behavior that represents the value of the input field.
var behavior = stepper('', valueStream);

// handle changes to the input value
behavior.changes((val) => {
  console.log('input value: ' + val);
});
```


## Utility Packages

EventStreams and Behaviors are the building blocks for everything else Frampton provides. Most of the convinience provided by functional reactive programming is by the abstractions that can be built on the core pieces. These are abstractions that Frampton is still developing.


### Frampton.Signals

Most of the lower-level abstractions for creating EventStreams and Behaviors will reside in the Signals package, which is also where the constructors for EventStream and Behavior are.

```
// To count all instance of an event
// This creates a behavior representing the number of times an event is called
var eventCount = count(stream);

// To create an empty event stream
// Use this to create a stream that you want to push values to.
var stream = empty();

// To create a stream that is called once per frame, it uses requestAnimationFrame.
// A new event is pushed every frame, useful for creating a game loop or similar mechanism
var stream = interval();

// To push the values of an array onto a stream with a given delay between events
// This emits the values 1,2,3 as separate events, 20 milliseconds appart.
var stream = sequential(20, [1,2,3]);

/**
 * To map Behavior values, the Behavior map functions take a function as the
 * first parameter and then a number of Behaviors. The function is called
 * immediately with the current values of the Behaviors and then is called
 * anytime one of the Behaviors updates. There are 5 curried versions of this
 * function and then a mapMany function that is not curried, but takes any
 * number of Behaviors.
 */
var mapped = map2((b1, b2) => b1 + b2, behavior1, behavior2);

/**
 * toggle takes 2 EventStreams and returns a Behavior whose initial value is false.
 * When the first stream recieves a value the Behavior toggles to true, when the
 * second stream recieves a value it toggles back to false... and so on.
 */
var behavior = toggle(stream1, stream2);
```


### Frampton.Mouse

The Mouse package only exports one function the Mouse function. It takes an optional first parameter of a DomNode. If no parameter is passed in the function will return an object whose EventStreams and Behaviors are relative to the window, otherwise they will be relative to the DomNode passed in.

```
var mouse = Mouse();

var div = document.getElementById('my-id');
var relativeMouse = Mouse(div);

// An EventStream of all clicks
mouse.clicks

// An EventStream of all mousedown events
mouse.downs

// An EventStream of all mouseup events
mouse.ups

// A Behavior representing position as [x Number, y Number]
mouse.position

// A Boolean Behavior indicating if the mouse is down
mouse.isDown
```