auto-form-polyfill
==================

Triggers change and input events when browsers autocomplete or autofill form inputs. Requires jQuery.

##The problem

When a browser autocompletes or autofills a form field, it can’t be guaranteed that change or input events will fire. This is particularly troublesome for frameworks like Angular that rely on the input event to bind elements to models. [Read this article from 2010](http://avernet.blogspot.in/2010/11/autocomplete-and-javascript-change.html) by Alessandro Vernet for more details. The problem hasn’t changed much in the four years since.

##The solution

This polyfill fires input and change events on the browser’s behalf. It uses polling to infer autocomplete and click events to infer autofill. The click event listener is bound to the window with event delegation to ensure that dynamic elements are included.

Polling is crude. Until there’s a standard, all solutions will be crude. **Expect to see false positives.**

##What’s the difference between autocomplete and autofill?

We’re using Chrome’s terminology here. “Autocomplete” means the browser supplies values for a whole form when it’s loaded. “Autofill” means the browser suggests values for individual fields on focus. It may also fill other fields in the same form.

##API

```javascript

// Not required - these are the defaults
autoFormPolyfill.configure({

	// Defensively assumes that all inputs have been autocompleted before .start() can be called
	fireChangesOnStart: true,

	// The more fields there are to poll, the bigger this number should be
	pollingIntervalMs: 100,

	// The change event refers specifically to user input - in the case of autofill/autocomplete, it's open to interpretation
	eventsToTrigger: ['input', 'change']

});

// Starts the polling and binds the click handler
autoFormPolyfill.start();

// Returns true
autoFormPolyfill.isRunning();

// Stops the polling and unbinds the click handler
autoFormPolyfill.stop();

// Now returns false
autoFormPolyfill.isRunning();

```

##Use with Angular

```javascript
function YourController ($scope) {

	autoFormPolyfill.start();

	// For apps with routes / deep-linking
	$scope.$on('$destroy', function () {
		autoFormPolyfill.stop();
	});

}
```
