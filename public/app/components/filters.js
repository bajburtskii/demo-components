(function () {
	'use strict';

	angular
		.module('app.filters', [])

		.filter('dateFormat', dateFormat)
		.filter('dateTimeFormat', dateTimeFormat)
		.filter('dateTimeFormatFlex', dateTimeFormatFlex)
		.filter('dateTimeFormat_MMddyyy', dateTimeFormat_MMddyyy)
		.filter('dateTimeFormat_HHmmss', dateTimeFormat_HHmmss)
		.filter('dateTimeFormat_hhmmssa', dateTimeFormat_hhmmssa)
		.filter('dateToISO', dateToISO)
		.filter('mDateDiff', mDateDiff)
		.filter('secondsToFormatedTime', secondsToFormatedTime)
		.filter('dateDiff', dateDiff)
		.filter('addDay', addDay)
		.filter('dateDiffAsYears', dateDiffAsYears) // Diff two date and return diff year(s)
		.filter('dateDiffAsMonths', dateDiffAsMonths) // Diff two date and return diff month(s)
		.filter('dateDiffAsDays', dateDiffAsDays) // Diff two date and return diff day(s)
		.filter('currencyFormat', currencyFormat)
		.filter('amount', amount)
		.filter('amountWithoutZero', amountWithoutZero)
		.filter('getAvaUrl', getAvaUrl) //get avatar by avaToken || userAvaToken. New version with backend config
		.filter('temp', temp) // Weather Temp
		//.filter('isEmpty', isEmpty)
		.filter('keys', keys)
		.filter('words', words)
		.filter('characters', characters)
		.filter('th', th)
		.filter('nl2br', nl2br) // Convert /n/r to <br>
		.filter('messageDayMonth', messageDayMonth)
		.filter('propsFilter', propsFilter)

		.filter('trans', trans)
		.filter('trans_or_empty', trans_or_empty)
		.filter('trans_plural', trans_plural)
		.filter('trans_as_array', trans_as_array)

		.filter('firstLetterAvatar', firstLetterAvatar)
		.filter('firstLetterColor', firstLetterColor)
		.filter('bindHtml', bindHtml)
		.filter('strip_tags', strip_tags)
		.filter('currentdate', currentdate)
		.filter('viewholder', viewholder)
		.filter('shortDayLabel', shortDayLabel)
		.filter('leagueImage', leagueImage)
	;

	/* Fn
	 ============================================================================================================= */

	//filter function
	function shortDayLabel() {
		return function (label) {
			return label.slice(0, 3);
		};
	}

	function leagueImage() {
		return function (title) {
			var defaultLeagues = ['nfl', 'nba', 'mlb', 'nhl'];
			if (defaultLeagues.indexOf(title) !== -1) {
				return '/images/league_team_'+title+'.jpg';
			}
			return '/images/league_team_leagues.jpg';
		};
	}
	currentdate.$inject = ['$filter'];
	function currentdate($filter) {
		return function () {
			return $filter('date')(new Date(), 'dd MMM yyyy');
		};
	}

	dateFormat.$inject = ['$filter'];
	function dateFormat($filter) {
		return function (input, format) {
			format = format || 'dd MMM yyyy';

			if (angular.isNumber(input)) {
				return $filter('date')(input, format);
			}

			input = $filter('dateToISO')(input);
			if (input) {
				return $filter('date')(input, format);
			} else {
				return input;
			}
		};
	}

	dateTimeFormat.$inject = ['$filter'];
	function dateTimeFormat($filter) {
		return function (input, format) {
			input = input + ' UTC';
			input = $filter('dateToISO')(input);
			format = format || 'dd MMM yyyy h:mm a';

			var timeZoneAbbr = new Date().toLocaleTimeString('en-us',{timeZoneName:'short'}).split(' ')[2];

			if (input) {
				return $filter('date')(input, format) + ' ' + timeZoneAbbr;
			} else {
				return input;
			}
		};
	}

	dateTimeFormat_MMddyyy.$inject = ['$filter'];
	function dateTimeFormat_MMddyyy($filter) {
		return function (input, format) {
			input = input + ' UTC';
			input = $filter('dateToISO')(input);
			format = format || 'MM/dd/yyyy';

			if (input) {
				return $filter('date')(input, format);
			} else {
				return input;
			}
		};
	}

	dateTimeFormat_HHmmss.$inject = ['$filter'];
	function dateTimeFormat_HHmmss($filter) {
		return function (input, format) {
			input = input + ' UTC';
			input = $filter('dateToISO')(input);
			format = format || 'HH:mm:ss';

			var timeZoneAbbr = new Date().toLocaleTimeString('en-us',{timeZoneName:'short'}).split(' ')[2];

			if (input) {
				return $filter('date')(input, format) + ' ' + timeZoneAbbr;
			} else {
				return input;
			}
		};
	}
        
	dateTimeFormat_hhmmssa.$inject = ['$filter'];
	function dateTimeFormat_hhmmssa($filter) {
		return function (input, format) {
			input = input + ' UTC';
			input = $filter('dateToISO')(input);
			format = format || 'hh:mm:ss a';

			var timeZoneAbbr = new Date().toLocaleTimeString('en-us',{timeZoneName:'short'}).split(' ')[2];

			if (input) {
				return $filter('date')(input, format) + ' ' + timeZoneAbbr;
			} else {
				return input;
			}
		};
	}

	dateTimeFormatFlex.$inject = ['$filter'];
	function dateTimeFormatFlex($filter) {
		return function (input, format) {
			if(input.length > 11){
				input = $filter('dateToISO')(input);
				format = format || 'dd MMM yyyy h:mm a';
				if (input) {
					return $filter('date')(input, format);
				} else {
					return input;
				}
			}else{
				format = format || 'dd MMM yyyy';

				if (angular.isNumber(input)) {
					return $filter('date')(input, format);
				}

				input = $filter('dateToISO')(input);
				if (input) {
					return $filter('date')(input, format);
				} else {
					return input;
				}
			}
		};
	}

	function dateToISO() {
		return function (input) {
			if (input instanceof Date) return input.toISOString(); // if input instanceof Date
			if (angular.isDefined(moment) && moment.isMoment(input)) return input.toISOString(); // if input instanceof moment
			if (input && input !== '0000-00-00 00:00:00' && input !== '0000-00-00 00:00:00' && input !== '0000/00/00 00:00:00') {
				input = input.toString().split('-').join('/').split('.').join('/');
				return new Date(input).toISOString();
			} else {
				return null;
			}
		};
	}

	function dateToLocal() {
		return function (input) {
			if (input instanceof Date) return input.toLocaleString(); // if input instanceof Date
			if (angular.isDefined(moment) && moment.isMoment(input)) return input.toLocaleString(); // if input instanceof moment
			if (input && input !== '0000-00-00 00:00:00' && input !== '0000-00-00 00:00:00' && input !== '0000/00/00 00:00:00') {
				input = input.toString().split('-').join('/').split('.').join('/');
				return new Date(input).toLocaleString();
			} else {
				return null;
			}
		};
	}

	mDateDiff.$inject = ['$filter'];
	function mDateDiff($filter) {
		return function (startDate, endDate, type) {
			startDate = startDate ? moment($filter('dateToISO')(startDate)) : moment();
			endDate = endDate ? moment($filter('dateToISO')(endDate)) : moment();
			type = type || 'months';

			return endDate.diff(startDate, type);
		};
	}

	secondsToFormatedTime.$inject = ['$filter'];
	function secondsToFormatedTime($filter) {
		return function (input) {
			var countHours = Math.floor(input / (60 * 60));
			input = input - (countHours * 60 * 60);
			var countMinutes = Math.floor(input / (60));
			var countSeconds = input - (countMinutes * 60);

			var text = '';
			if (countHours > 0) {
				countHours = "0" + countHours;
				text = text + countHours.substr(-2) + ':';
			}
			if (countMinutes > 0 || countHours > 0) {
				countMinutes = "0" + countMinutes;
				text = text + countMinutes.substr(-2) + ':';
			}
			countSeconds = "0" + countSeconds;
			text = text + countSeconds.substr(-2);

			return text;
		};
	}

	function dateDiff() {
		var millisecondsPerDay = 24 * 60 * 60 * 1000;

		function treatAsUTC(date) {
			var result = new Date(date);
			result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
			return result;
		}

		return function (startDate, endDate) {
			endDate = endDate || new Date();
			var diff = Math.floor(treatAsUTC(endDate) / millisecondsPerDay) - Math.floor(treatAsUTC(startDate) / millisecondsPerDay);
			return ( typeof diff == 'number' && !isNaN(diff) ) ? diff : null;
		};
	}

	addDay.$inject = ['$filter'];
	function addDay($filter) {
		return function (date, numOfDays) {
			date = new Date($filter('dateToISO')(date));
			numOfDays = numOfDays || 0;
			return new Date(date.setDate(date.getDate() + numOfDays));
		};
	}

	dateDiffAsYears.$inject = ['$filter'];
	function dateDiffAsYears($filter) {
		return function (startDate, endDate) {
			if (endDate) {
				var d1 = new Date($filter('dateToISO')(endDate))
			} else {
				var d1 = new Date();
			}
			var d2 = new Date($filter('dateToISO')(startDate));

			var age = d1.getFullYear() - d2.getFullYear();
			var m = d1.getMonth() - d2.getMonth();
			if (m < 0 || (m === 0 && d1.getDate() < d2.getDate())) {
				age--;
			}
			return age;
		};
	}

	dateDiffAsMonths.$inject = ['$filter'];
	function dateDiffAsMonths($filter) {
		return function (startDate, endDate) {
			if (endDate) {
				var d2 = new Date($filter('dateToISO')(endDate))
			} else {
				var d2 = new Date();
			}
			var d1 = new Date($filter('dateToISO')(startDate));

			var months = (d2.getFullYear() - d1.getFullYear()) * 12;

			months -= d1.getMonth() + 1;
			months += d2.getMonth();
			return months <= 0 ? 0 : months;
		};
	}


	dateDiffAsDays.$inject = ['$filter'];
	function dateDiffAsDays($filter) {
		return function (startDate, endDate) {
			if (endDate) {
				var d2 = new Date($filter('dateToISO')(endDate))
			} else {
				var d2 = new Date();
			}
			var d1 = new Date($filter('dateToISO')(startDate));

			var millisecondsPerDay = 1000 * 60 * 60 * 24;
			var millisBetween = d2.getTime() - d1.getTime();
			var days = millisBetween / millisecondsPerDay;

			return Math.floor(days);
		};
	}

	/**
	 * Format amount according to selected currency
	 */
	currencyFormat.$inject = ['$filter', '$locale', '$rootScope'];
	function currencyFormat($filter, $locale, $rootScope) {
		var currencyFilter = $filter('currency');
		var formats = $locale.NUMBER_FORMATS;
		return function(amount) {
			amount = amount ? (amount*1).toFixed(2) : 0.00;
			var value = currencyFilter(amount, '$');
			// split into parts
			var parts = value.split(formats.DECIMAL_SEP);
			var dollar = parts[0];
			var cents = parts[1] || '00';
			cents = cents.substring(0,2)=='00' ? cents.substring(2) : '.'+cents; // remove "00" cent amount
			return dollar + cents;
		};
	}
    
    amount.$inject = ['$filter'];
	function amount($filter) {
		return function (input, symbol) {
			if (isNaN(input)) {
				input = 0;
			}
			
			input = $filter('number')(input);

			if(symbol) {
				return symbol + ' ' + input;
			} else {
				return input;
			}

		};
	}

	function amountWithoutZero() {
		return function (input) {
			input = parseFloat(input);

			if (isNaN(input)) {
				input = 0;
			}

			var amount = input.toFixed(0);
			return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		};
	}

	function bytesToHuman() {
		return function (bytes, precision) {
			if (bytes == 0) {
				return 0 + ' ' + 'MB';
			}
			if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
			if (typeof precision === 'undefined') precision = 1;
			var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
				number = Math.floor(Math.log(bytes) / Math.log(1024));
			return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
		};
	}

	/**
	 *
	 * @type {string[]}
	 *
	 * Example: ng-src="{{ item.avaToken | getAvaUrl:6:'preview:jpg' }}"
	 */
	getAvaUrl.$inject = ['FileService'];
	function getAvaUrl(FileService) {
		return function (token, type, size, ext) {
			size = size || 'preview';
			ext = ext || false;

			return FileService.src(type, token, size, ext);
		};
	}

	temp.$inject = ['$filter'];
	function temp($filter) {
		return function (input, precision) {
			if (!precision) {
				precision = 0;
			}
			var numberFilter = $filter('number');
			return numberFilter(input, precision) + '\u00B0C';
		};
	}

	function keys() {
		return function (input) {
			if (!input) {
				return [];
			}
			return Object.keys(input);
		};
	}

	function words() {
		return function (input, words) {
			if (isNaN(words)) return input;
			if (words <= 0) return '';
			if (input) {
				var inputWords = input.split(/\s+/);
				if (inputWords.length > words) {
					input = inputWords.slice(0, words).join(' ') + '...';

				}
			}

			return input;
		};
	}

	function characters() {
		return function (input, chars, breakOnWord) {

			if (isNaN(chars)) return input;
			if (chars <= 0) return '';
			if (input && input.length > chars) {
				input = input.substring(0, chars);

				if (!breakOnWord) {
					var lastspace = input.lastIndexOf(' ');
					//get last space
					if (lastspace !== -1) {
						input = input.substr(0, lastspace);
					}
				} else {
					while (input.charAt(input.length - 1) === ' ') {
						input = input.substr(0, input.length - 1);
					}
				}

				return input + '...';
			}
			return input;
		};
	}

	function th() {
		return function (input) {
			input = parseInt(input);

			var end = 'th';

			if (input == 1) {
				end = 'st';
			} else if (input == 2) {
				end = 'nd';
			} else if (input == 3) {
				end = 'rd';
			}

			return input + end;
		};
	}

	function nl2br() {
		return function (msg) {
			var is_xhtml = is_xhtml || true;
			var breakTag = (is_xhtml) ? '<br />' : '<br>';
			var msg = (msg + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
			return msg;
		}
	}

	/**
	 * Get day and month
	 * Example: 12 June
	 */
	messageDayMonth.$inject = ['$filter'];
	function messageDayMonth($filter) {
		return function (input) {
			return $filter('date')($filter('dateToISO')(input), 'd MMMM')
		};
	}

	/**
	 * Filter for UI-SELECT
	 */
	propsFilter.$inject = [];
	function propsFilter() {
		return function (items, props) {
			var out = [];

			if (angular.isArray(items)) {
				items.forEach(function (item) {
					var itemMatches = false;

					var keys = Object.keys(props);
					for (var i = 0; i < keys.length; i++) {
						var prop = keys[i];
						var text = (typeof props[prop] === 'string') ? props[prop].toLowerCase(): '';
						if (item[prop] !== null && typeof item[prop] !== 'undefined' && item[prop].toString().toLowerCase().indexOf(text) !== -1) {
							itemMatches = true;
							break;
						}
					}

					if (itemMatches) {
						out.push(item);
					}
				});
			} else {
				// Let the output be the input untouched
				out = items;
			}

			return out;
		}
	}

	/**
	 * Get translation from resources.
	 * Example:
	 * 'pagination.next' | trans => 'Next'
	 */
	trans.$inject = ['$rootScope'];
	function trans($rootScope) {
		return function (input, replaces) {
			// Set symbol
			replaces = _.extend({symbol: $rootScope.auth.currency_symbol || '$'}, replaces || {});
			return Lang.get(input, replaces);
		};
	}

	/**
	 * Get translation from resources, empty.
	 * Example:
	 * 'pagination.next' | trans => 'Next'
	 */
	trans_or_empty.$inject = ['$rootScope'];
	function trans_or_empty($rootScope) {
		return function (input, replaces, emptySymbol) {
			// Set symbol
			replaces = _.extend({symbol: $rootScope.auth.currency_symbol || '$'}, replaces || {});

			if (Lang.has(input)) {
				return Lang.get(input, replaces);
			} else {
				return emptySymbol ? emptySymbol : '';
			}
		};
	}

	/**
	 * Get translation from resources.
	 * Example:
	 * 'subscription.month' | trans_plural:1 => 'month'
	 * 'subscription.month' | trans_plural:2 => 'months'
	 */
	function trans_plural() {
		return function (input, number) {
			return Lang.choice(input, number);
		};
	}

	/**
	 * Convert translation object to array from resources.
	 * Example:
	 * 'property.property_types' | trans_as_array
	 */
	function trans_as_array() {
		return function (input) {
			if (typeof Lang.get(input) !== 'object') {
				console.error('Error, ' + input + 'not a object.');
				return [];
			}
			var newOptions = [];
			angular.forEach(Lang.get(input), function (val, key) {
				newOptions.push({key: key, value: val});
			});

			return newOptions;
		};
	}

	/*
	 * Find first letter Avatar name
	 * Example Vasa Pupkin =>  VP
	 */
	function firstLetterAvatar() {
		return function (input) {
			var newLines = "";

			if (input != undefined) {
				var lines = input.match(/[^\s]+/g);

				for (var i = 0; i < lines.length; i++) {
					if (i < 2) {
						newLines = newLines + lines[i].charAt(0).toUpperCase();
					}
				}
			}

			return newLines;
		}
	}


	function firstLetterColor() {
		return function (input) {
			var lines = input;

			var keyCode = lines.charCodeAt(0);

			if (keyCode > 64 && keyCode < 71) {
				return 'statusPurple';
			} else if (keyCode >= 71 && keyCode < 78) {
				return 'statusGreen';
			} else if (keyCode >= 78 && keyCode < 84) {
				return 'statusYellow';
			} else if (keyCode >= 84 && keyCode < 91) {
				return 'statusBlue';
			} else {
				return '';
			}
		}
	}

	bindHtml.$inject = ['$sce'];
	function bindHtml($sce) {
		return function (val) {
			return $sce.trustAsHtml(val);
		};
	}

	function strip_tags() {
		return function strip_tags(input, allowed) {
			allowed = (((allowed || '') + '')
				.toLowerCase()
				.match(/<[a-z][a-z0-9]*>/g) || [])
				.join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
			var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
				commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
			return input.replace(commentsAndPhpTags, '')
				.replace(tags, function ($0, $1) {
					return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
				});
		}
	}

	function viewholder() {
		return function (input) {
			return input ? input : "&mdash;";
		}
	}
	


})();
