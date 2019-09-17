(function () {
	'use strict';

	angular
		.module('app.factories', [])

		.factory('authInterceptor', authInterceptor)
		.factory('AuthDataService', AuthDataService)
		.factory('Socket', Socket)
		.factory('playerStatDictionary', playerStatDictionary)
	;

	/* Fn
	 ============================================================================================================= */
	authInterceptor.$inject = ['$rootScope', '$q', '$timeout', '$location'];
	function authInterceptor($rootScope, $q, $timeout, $location) {
		return {
			response: function (response) {
				
				var freshJwt = response.headers()['authorization'];
				if (freshJwt) {
					//refresh local token
					localStorage.setItem('leagues-jwt-token', freshJwt);
				}

				if (typeof response.data == 'object') {

					// Redirect to page, if user was not authorized.
					if (response.data.authorization === false) {
						$rootScope.auth = null;
						localStorage.removeItem('leagues-jwt-token');
						localStorage.removeItem('satellizer_token');
						$timeout(function () {
							$location.path('/login');
						});
					}
				}

				return response;
			},

			// Intercept 401s and redirect you to login
			responseError: function (response) {
				if(response.status === 401) {
					// remove any stale tokens
					$rootScope.auth = null;
					localStorage.removeItem('leagues-jwt-token');
					localStorage.removeItem('satellizer_token');
					$timeout(function () {
						$location.path('/login');
					});
					return $q.reject(response);
				}
				else {
					return $q.reject(response);
				}
			}
		};
	}

	AuthDataService.$inject = ['$rootScope'];
	function AuthDataService($rootScope, CordovaService) {
		// var current_jwt;
		// current_jwt = localStorage.getItem('leagueswipe-jwt-token');
		// if (current_jwt) {
		// 	$http.defaults.headers.common['Authorization'] = current_jwt;
		// }
		return {
			setAuthData: function(user, jwt_bearer) {
				$rootScope.auth = user;
				localStorage.setItem('leagues-jwt-token', jwt_bearer);
				localStorage.removeItem('satellizer_token');
				// return $http.defaults.headers.common['Authorization'] = "Basic " + encoded;
			},
			clearAuthData: function() {
				$rootScope.auth = null;
				localStorage.removeItem('leagues-jwt-token');
				localStorage.removeItem('satellizer_token');
				// return $http.defaults.headers.common['Authorization'] = '';
			},
			getToken: function() {
				return localStorage.getItem('leagues-jwt-token');
			}
		};
	}

	// http://habrahabr.ru/post/215427/
	Socket.$inject = ['$rootScope'];
	function Socket($rootScope) {
		var connections = {};  // пул соединений, каждое из которых создается по требованию

		function getConnection(channel) {
			if (!connections[channel]) {
				connections[channel] = io.connect('http://localhost:3000/' + channel, {secure: true});
			}

			return connections[channel];
		}

		// При создании нового сокета, он инициализируется namespace-частью строки подключения.
		function Socket(namespace) {
			this.namespace = namespace;
		}

		Socket.prototype.on = function (eventName, callback) {
			var con = getConnection(this.namespace), self = this;  // получение или создание нового соединения
			con.on(eventName, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(con, args);
				});
			});
		};

		Socket.prototype.emit = function (eventName, data, callback) {
			var con = getConnection(this.namespace);                   // получение или создание нового соединения.
			con.emit(eventName, data, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(con, args);
					}
				});
			})
		};

		return Socket;
	}

    function playerStatDictionary() {
    	return {
            mlb: {
            	 '0': {acronym:  'GP',		full: 'Games Played' },
            	 '1': {acronym:  'GS',		full: 'Games Started' }, 
            	 '3': {acronym:  'AVG', 	full: 'Batting Average'},
            	 '4': {acronym:  'OBP', 	full: 'On Base Percentage'},
            	 '5': {acronym:  'SLG', 	full: 'Slugging Percentage'},
            	 '6': {acronym:  'AB', 		full: 'At Bats'},
            	 '7': {acronym:  'R', 		full: 'Runs'},
            	 '8': {acronym:  'H', 		full: 'Hits'},
            	 '9': {acronym:  '1B', 		full: 'Singles'},
            	'10': {acronym:  '2B', 		full: 'Doubles'},
            	'11': {acronym:  '3B', 		full: 'Triples'},
            	'12': {acronym:  'HR', 		full: 'Home Runs'},
            	'13': {acronym:  'RBI', 	full: 'Runs Batted In'},
            	'14': {acronym:  'SH', 		full: 'Sacrifice Hits'},
            	'15': {acronym:  '3B', 		full: 'Triples'},
            	'16': {acronym:  'SB', 		full: 'Stolen Bases'},
            	'17': {acronym:  'CS', 		full: 'Caught Stealing'},
            	'18': {acronym:  'BB', 		full: 'Base on Balls'},
            	'19': {acronym:  'IBB', 	full: 'Intentional Walks'},
            	'20': {acronym:  'HBP', 	full: 'Hit by Pitch'},
            	'21': {acronym:  'K', 		full: 'Strikeouts'},
            	'22': {acronym:  'GDP', 	full: 'Grounded into Double-Play'},
            	'23': {acronym:  'TB', 		full: 'Total Bases'},
            	'24': {acronym:  'GP',		full: 'Games Played' }, 
            	'25': {acronym:  'GS',		full: 'Games Started' }, 
            	'26': {acronym:  'ERA', 	full: 'Earned Run Average'},
            	'27': {acronym:  'WHIP', 	full: '(Walks + Hits)/Innings Pitched'},
            	'28': {acronym:  'W', 		full: 'Wins'},
            	'29': {acronym:  'L',		full: 'Losses' }, 
            	'30': {acronym:  'CG',		full: 'Complete Games' },
            	'31': {acronym:  'SH',		full: 'Shut Outs' },  
            	'32': {acronym:  'SV', 		full: 'Saves'},
            	'34': {acronym:  'HA', 		full: 'Hits Allowed'},
            	'35': {acronym:  'BF', 		full: 'Batters Faced'},
            	'36': {acronym:  'RA', 		full: 'Runs Allowed'},
            	'37': {acronym:  'ER', 		full: 'Earned Runs Allowed'},
            	'38': {acronym:  'HRA', 	full: 'Home Runs Allowed'},
            	'39': {acronym:  'BB', 		full: 'Walks'},
                '40': {acronym:  'IBB', 	full: 'Intentional Walks'},
            	'41': {acronym:  'HBP', 	full: 'Players Hit by Pitch'},
            	'42': {acronym:  'K', 		full: 'Strikeouts'},
            	'43': {acronym:  'WP', 		full: 'Wild Pitches'},
            /**/'44': {acronym:  'BK', 		full: 'Balks'},
            /**/'45': {acronym:  'SB', 		full: 'Stolen Bases Against'},
            /**/'46': {acronym:  'GIDP', 	full: 'Grounded Into Double-Plays'},
            	'50': {acronym:  'IP', 		full: 'Innings Pitched'},
            	'51': {acronym:  'PO', 		full: 'Put Out'},
            	'52': {acronym:  'A', 		full: 'Assists'},
            	'53': {acronym:  'E', 		full: 'Errors'},
            	'54': {acronym:  'FPCT', 	full: 'Fielding Percentage'},
            	'55': {acronym:  'OPS', 	full: 'OPS = OBP + SLG'},
            	'56': {acronym:  'SO/W', 	full: 'Strikeout-To-Walk Ratio'},
            	'57': {acronym:  'K/9', 	full: 'Strikeouts per Nine Innings'},
            	'60': {acronym:  'H/AB',	full: 'Hits vs. At Bats'},
            	'61': {acronym:  'XBH', 	full: 'Extra Base Hits'},
            	'62': {acronym:  'SH', 		full: 'Sacrifice Hits'},
            	'65': {acronym:  'TPA', 	full: 'Total Plate Appearances'},
            	'67': {acronym:  'PIT', 	full: 'Pitches Made'},
            /**/'68': {acronym:  'IgCS%', 	full: 'League Caught Stealing Percentage'},
                '73': {acronym:  'G', 		full: 'Games Played'},
                '74': {acronym:  'OBP', 	full: 'Opponent On Base Percentage'},
            	'75': {acronym:  'WPCT', 	full: 'Winning Percentage'},
            	'77': {acronym:  'H/9', 	full: 'Hits per Nine Innings'},
            	'78': {acronym:  'BB/9', 	full: 'Walks per Nine Innings'},
            /**/'81': {acronym:  'P*WHIP', 	full: 'Projected Total (Walks + Hits)/Innings Pitched'},
            	'83': {acronym:  'QS', 		full: 'Quality Starts'},
            /**/'90': {acronym:  'P*ER', 	full: 'Projected Total Earned Runs Allowed'}
                },
            nhl: {},
            nfl: {},
            nba: {},
    	}
    }

})();
