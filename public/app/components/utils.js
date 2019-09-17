(function () {
	'use strict';

	angular
		.module('app.utils', [])

		.factory('array_util', array_util)
		.factory('string_util', string_util)
		.factory('ng_util', ng_util)
	;

	function array_util() {
		var util_array = {
			partition: partition,
			uniqueItems: uniqueItems,
			chunk: chunk,
			split: split,
			imgload: imgload,
			sortObject: sortObject,
			convertObjectKeyToString: convertObjectKeyToString
		};

		return util_array;


		/**
		 * Divide into parts
		 * @param items
		 * @param size
		 * @returns {Array}
		 */
		function partition(items, size) {
			var result = _.groupBy(items, function (item, i) {
				return Math.floor(i / size);
			});
			return _.values(result);
		}

		/**
		 * Load image
		 * @param src
		 * @param callback
		 */
		function imgload(src, callback) {
			var image = new Image();
			image.src = src;
			$(image).load(function () {
				callback();
			});
		}

		/**
		 * Return array of unique values from collections
		 * @param data
		 * @param key
		 * @returns {Array}
		 */
		function uniqueItems(data, key, sort) {
			var result = [];
			for (var i = 0; i < data.length; i++) {
				var value = data[i][key];
				if (result.indexOf(value) === -1) {
					result.push(value);
				}
			}

			if (sort) {
				result = _.sortBy(result, function (val) {
					return val;
				});
			}
			return result;
		}

		/**
		 * Get {start} nested arrays each containing maximum of {amount} items
		 * @param arr
		 * @param start
		 * @param amount
		 * @returns {Array}
		 */
		function chunk(arr, start, amount) {
			var result = [],
				start = start || 0,
				amount = amount || 500,
				len = arr.length;

			do {
				result.push(arr.slice(start, start + amount));
				start += amount;

			} while (start < len);

			return result;
		}

		function split(a, n) {
			var len = a.length, out = [], i = 0;
			while (i < len) {
				var size = Math.ceil((len - i) / n--);
				out.push(a.slice(i, i += size));
			}
			return out;
		}

		function convertObjectKeyToString(obj) {
			var arr = {};
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					arr[prop.toString()] = obj[prop];
				}
			}
			return arr;
		}

		function sortObject(obj) {
			var arr = [];
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					arr.push({
						'key': prop,
						'value': obj[prop]
					});
				}
			}
			arr.sort(function (a, b) {
				return a.value - b.value;
			});
			//arr.sort(function(a, b) { a.value.toLowerCase().localeCompare(b.value.toLowerCase()); }); //use this to sort as strings
			return arr; // returns array
		}
	}

	function string_util() {

		var util_array = {
			similar_text: similar_text,
			split_chars: splitNChars,
			base64_decode: base64_decode
		};

		return util_array;

		function splitNChars(txt, num) {
			var result = [];
			for (var i = 0; i < txt.length; i += num) {
				result.push(txt.substr(i, num));
			}
			return result;
		}

		function similar_text(first, second, percent) {
			//  discuss at: http://phpjs.org/functions/similar_text/
			// original by: Rafał Kukawski (http://blog.kukawski.pl)
			// bugfixed by: Chris McMacken
			// bugfixed by: Jarkko Rantavuori original by findings in stackoverflow (http://stackoverflow.com/questions/14136349/how-does-similar-text-work)
			// improved by: Markus Padourek (taken from http://www.kevinhq.com/2012/06/php-similartext-function-in-javascript_16.html)
			//   example 1: similar_text('Hello World!', 'Hello phpjs!');
			//   returns 1: 7
			//   example 2: similar_text('Hello World!', null);
			//   returns 2: 0

			if (first === null || second === null || typeof first === 'undefined' || typeof second === 'undefined') {
				return 0;
			}

			first += '';
			second += '';

			var pos1 = 0,
				pos2 = 0,
				max = 0,
				firstLength = first.length,
				secondLength = second.length,
				p, q, l, sum;

			max = 0;

			for (p = 0; p < firstLength; p++) {
				for (q = 0; q < secondLength; q++) {
					for (l = 0;
						 (p + l < firstLength) && (q + l < secondLength) && (first.charAt(p + l) === second.charAt(q + l)); l++)
						;
					if (l > max) {
						max = l;
						pos1 = p;
						pos2 = q;
					}
				}
			}

			sum = max;

			if (sum) {
				if (pos1 && pos2) {
					sum += this.similar_text(first.substr(0, pos1), second.substr(0, pos2));
				}

				if ((pos1 + max < firstLength) && (pos2 + max < secondLength)) {
					sum += this.similar_text(first.substr(pos1 + max, firstLength - pos1 - max), second.substr(pos2 + max,
						secondLength - pos2 - max));
				}
			}

			if (!percent) {
				return sum;
			} else {
				return (sum * 200) / (firstLength + secondLength);
			}
		}

		function base64_decode(c) {
			0 <= c.indexOf("=") && (c = c.substr(0, c.indexOf("=")));
			for (var k = 0, d = 0, b, l, e, g, f = 0, a, h, m = ""; k < c.length; ++k) {
				l = "=" == c.charAt(k) ? 0 : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(c.charAt(k));
				d = (d + 6) % 8;
				if (6 != d) {
					b += l >> d;
					if (0 == f)g = !0, h = 0, e = 1, 128 > b && (e = 0, h = b & 64, g = !1); else if (128 != (b & 192))return !1;
					for (a = 32; g && 0 < a; a >>= 1)b & a ? ++e : g = !1;
					g || (a = 6 + 6 * f - e, 6 < a && (a = 6), a && (h += b % (1 << a) << 6 * (e - f)));
					f == e ? (m += String.fromCharCode(h), f = 0) : ++f
				}
				b = d ? l % (1 << d) << 8 - d : 0
			}
			return m
		}
	}

	function ng_util() {
		var util_array = {
			safeApply: safeApply,
			safeDigest: safeDigest
		};

		return util_array;

		function safeApply($scope, fn) {
			if ($scope.$root && $scope.$root.$$phase) {
				var phase = $scope.$root.$$phase;
				if (phase == '$apply' || phase == '$digest') {
					if (fn && (typeof(fn) === 'function')) {
						fn();
					}
				} else {
					$scope.$apply(fn || angular.noop);
				}
			} else {
				$scope.$apply(fn || angular.noop);
			}
		}

		function safeDigest($scope, fn) {
			if ($scope.$root && $scope.$root.$$phase) {
				var phase = $scope.$root.$$phase;
				if (phase == '$apply' || phase == '$digest') {
					if (fn && (typeof(fn) === 'function')) {
						fn();
					}
				} else {
					$scope.$digest(fn || angular.noop);
				}
			} else {
				$scope.$digest(fn || angular.noop);
			}
		}
	}

})();
