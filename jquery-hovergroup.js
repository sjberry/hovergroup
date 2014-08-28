(function(root, factory) {
	if (typeof module === 'object' && module && typeof module.exports === 'object') {
		module.exports = factory.call(root,
			require('jquery')
		);
	}
	else if (typeof define === 'function' && define.amd) {
		define(['jquery'], function() {
			return factory.apply(root, arguments);
		});
	}
	else {
		factory.call(root, window.jQuery);
	}
})(this, function($) {
	'use strict';

	var settings = {
		selector: 'data-hg',
		cls: 'hg-hover'
	};

	// Adding jQuery regular expression filter support if it doesn't exist already.
	// This solution is closely adapted from James Padolsey's tutorial found at:
	// http://james.padolsey.com/javascript/regex-selector-for-jquery/

	if (typeof $.expr[':'].regex === 'undefined') {
		$.expr[':'].regex = function(elem, index, match) {
			var matchParams, method, property, re, validLabels;

			matchParams = match[3].split(',');
			validLabels = /^(data|css):/;
			method = matchParams[0].match(validLabels) ? matchParams[0].split(':')[0] : 'attr';
			property = matchParams.shift().replace(validLabels, '');
			re = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g, ''), 'ig');

			return re.test($(elem)[method](property));
		};
	}

	function _getAttrSelector() {
		return '[' + settings.selector + ']';
	}


	function _getRegExpSelector(str) {
		var pattern, selector;

		pattern = '(' + $.trim(str).replace(/\s+/g, '|') + ')';
		selector = ':regex(' + settings.selector + ',' + pattern + ')';

		return selector;
	}


	$.extend({
		hovergroup: {
			settings: settings
		}
	});

	$.fn.extend({
		hovergroup: function() {
			var attrSelector;

			attrSelector = _getAttrSelector();

			$(this).on('mouseenter.hovergroup mouseleave.hovergroup', attrSelector, function(e) {
				var group, selector, $set;

				group = $(this).attr(settings.selector);
				selector = _getRegExpSelector(group);
				$set = $(selector);

				if (e.type === 'mouseenter') {
					$set.addClass(settings.cls);
				}
				else {
					$set.removeClass(settings.cls);
				}
			});
		},

		unhovergroup: function() {
			var attrSelector;

			attrSelector = _getAttrSelector();

			$(this).off('mouseenter.hovergroup mouseleave.hovergroup', attrSelector);
		}
	});
});
