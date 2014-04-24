(function (global, document, $) {


	'use strict';


	var isRunning = false,
		eventToListenFor = 'click',
		elementsToLookFor = 'input, select',
		autoFormPolyfill = {},
		configuration = {},
		eventHandler,
		pollFunction,
		isElementChanged,
		triggerEvents,
		intervalId;


	// Defaults
	configuration.fireChangesOnStart = true;
	configuration.pollingIntervalMs = 100;
	configuration.eventsToTrigger = ['input', 'change'];


	eventHandler = function () {
		if (isElementChanged($(this))) {
			triggerEvents($(this));
		}
	};


	pollFunction = function () {
		$(elementsToLookFor).each(function () {
			if (isElementChanged($(this))) {
				triggerEvents($(this));
			}
		});
	};


	isElementChanged = function ($element) {

		if ($element.data('auto-form-polyfill') !== $element.val()) {
			$element.data('auto-form-polyfill', $element.val());
			return true;
		}

		return false;

	};


	triggerEvents = function ($elements) {

		$.each(configuration.eventsToTrigger, function (index, eventType) {
			$elements.trigger(eventType);
		});

	};


	autoFormPolyfill.configure = function (newConfiguration) {

		var optionName;

		if (isRunning) {
			throw new Error('Cannot configure autoFormPolyfill while it\'s running');
		}

		for (optionName in newConfiguration) {
			configuration[optionName] = newConfiguration[optionName];
		}

		return autoFormPolyfill;

	};


	autoFormPolyfill.start = function () {

		if (isRunning) {
			return autoFormPolyfill;
		}

		$(document).ready(function () {

			$(elementsToLookFor).each(function () {
				$(this).data('auto-form-polyfill', $(this).val());
			});

			if (configuration.fireChangesOnStart) {
				triggerEvents($(elementsToLookFor));
			}

			pollFunction();
			intervalId = window.setInterval(pollFunction, configuration.pollingIntervalMs);

		});

		$(window).on(eventToListenFor, elementsToLookFor, eventHandler);

		return autoFormPolyfill;

	};


	autoFormPolyfill.stop = function () {

		if (!isRunning) {
			return autoFormPolyfill;
		}

		if (typeof intervalId === 'number') {
			window.clearInterval(intervalId);
		}

		$(window).off(eventToListenFor, elementsToLookFor, eventHandler);

		return autoFormPolyfill;

	};


	autoFormPolyfill.isRunning = function () {

		return isRunning;

	};


	global.autoFormPolyfill = autoFormPolyfill;


})(window, document, jQuery);
