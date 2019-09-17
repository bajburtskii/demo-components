(function () {
	'use strict';

	angular
		.module('app.services', [])

		.service('FileService', FileService)
		.service('HttpService', HttpService)
		.service('ConfigService', ConfigService)
		.service('BreadCrumbsService', BreadCrumbsService)
		.service('SeoService', SeoService)
		.service('CordovaService', CordovaService)
	;


	OverlayService.$inject = ['$compile', '$rootScope'];
	function OverlayService($compile, $rootScope) {

		var TEMPLATE_STRING = '<div class="overlay overlay-simplegenie" ng-class="show ? \'open\' : \'hide\'"><button type="button" class="overlay-close" ng-click="hide()"></button><div ng-include src="url"></div></div>',
			element = angular.element(TEMPLATE_STRING),
			scope = $rootScope.$new();

		scope.show = false;

		// create layer if dom is ready
		angular.element(document).ready(function () {
			element = $compile(element)(scope);
			angular.element('.page-content-wrapper').append(element);
		});

		scope.hide = function () {
			// angular.element(document.body).css('overflow-y', 'scroll');
			angular.element('.l-body').removeClass('l-body-overlay');
			scope.show = false;
		};

		// show function --> allows to overwrite defaults per show
		this.show = function (url, obj) {
			scope.url = url;

			scope.data = obj;

			angular.element('.l-body').addClass('l-body-overlay');
			angular.element('.l-body').removeClass('menu-pin sidebar-visible');
			scope.show = true;
		};

		this.hideAll = function () {
			// reactivate body scrolling
			angular.element('.l-body').removeClass('l-body-overlay');
			scope.show = false;
		};
	}

	/* Fn
	 ============================================================================================================= */
	FileService.$inject = ['CONFIG'];
	function FileService(CONFIG) {
		var cfg = CONFIG.files;
		this.src = function (type, token, size, ext) {
			ext = ext || false;
			type = parseInt(type);
			if (typeof token !== 'undefined' && token) {
				return CONFIG.host + ['', cfg.assets_dir, cfg.dir[type], token[0], token[1], token[2], token, size + '.' + (ext ? ext : (cfg.sizes[type][size].format || 'jpg') )].join('/');
			} else {
				if (cfg.rules[type].type == '1') {
					//log(this.config.rules[type]);
					return CONFIG.host + '/images/stubs/' + cfg.dir[type] + '/' + size + '.jpg';
				}
				else {
					//log(this.config);
					return CONFIG.host + '/images/stubs/' + cfg.dir[type] + '/' + size + '.jpg';
				}
			}
		}
	}

	HttpService.$inject = ['$http', '$rootScope', 'CONFIG', 'AuthDataService', 'CordovaService'];
	function HttpService($http, $rootScope, CONFIG, AuthDataService, CordovaService) {
		var baseUrl = CONFIG.host;
		var currentFormName = 'form';

		return {
			get: getFn,
			getWithChange: getFnWithChange,
			getWParams: getFnWParams,
			post: postFn,
			put: putFn,
			delete: deleteFn,
			setCurrentFormName: setCurrentFormName,
			getCurrentFormName: getCurrentFormName
		};

		function getCurrentFormName() {
			return currentFormName;
		}

		function setCurrentFormName(formName) {
			currentFormName = formName;
		}

		/* --- Functions --- */
		function config(options) {
			var config = {
				withCredentials: true,
				headers: {
					'Authorization': AuthDataService.getToken()
				}
			};

			if(!!window.cordova) {
				config.headers['Device'] = CordovaService.getDeviceHeaderValue();
			}

			if (options) _.extend(config, options);

			return config;
		}

		function successCallback(resp, callback) {
			if (callback) {
				return callback(resp);
			} else {
				return resp;
			}
		}

		function errorCallback(resp, callback) {
			if (callback) {
				return callback(resp);
			} else {
				return resp;
			}
		}

		function getFn(url, callback, errorCb) {
			url = baseUrl + url;
			return $http.get(url, config())
				.success(function (resp) {
					if (callback) callback(resp);
				})
				.error(function (resp) {
					if (errorCb) errorCallback(resp, errorCb)
				});
		}

		function getFnWithChange(url, callback, errorCb) {
			//var deferred = $q.defer();
			//getFn(url, callback)
		}

		function getFnWParams(url, params, callback, errorCb) {
			params = params || {};
			_.extend(params, config());
			url = baseUrl + url;
			return $http.get(url, params)
				.success(function (resp) {
					successCallback(resp, callback);
				})
				.error(function (resp) {
					errorCallback(resp, errorCb);
				});
		}

		function postFn(url, data, callback, errorCb) {
			$rootScope.$emit('form:submitted');

			url = baseUrl + url;
			return $http.post(url, data, config())
				.success(function (resp) {
					$rootScope.$emit('form:success');
					if (callback) successCallback(resp, callback);
				})
				.error(function (resp) {
					$rootScope.$emit('form:error', resp);
					if (errorCb) errorCallback(resp, errorCb);
				});
		}

		function putFn(url, data, callback, errorCb) {
			$rootScope.$emit('form:submitted');

			url = baseUrl + url;
			return $http.put(url, data, config())
				.success(function (resp) {
					$rootScope.$emit('form:success');
					successCallback(resp, callback);
				})
				.error(function (resp) {
					$rootScope.$emit('form:error', resp);
					if (errorCb) errorCallback(resp, errorCb);
				});
		}

		function deleteFn(url, callback, errorCb) {
			$rootScope.$emit('form:submitted');

			url = baseUrl + url;
			return $http.delete(url, config())
				.success(function (resp) {
					$rootScope.$emit('form:success');
					successCallback(resp, callback);
				})
				.error(function (resp) {
					$rootScope.$emit('form:error', resp);
					if (errorCb) errorCallback(resp, errorCb);
				});
		}
	}

	ConfigService.$inject = ['CONFIG'];
	function ConfigService(CONFIG) {
		this.get = function () {
			return CONFIG;
		}
	}

	BreadCrumbsService.$inject = [];
	function BreadCrumbsService() {
		this.addCrumb = function (label, state) {
			state = state || false;

			crumbs.push({
				state: state,
				label: label
			});
		};

		this.getCrumbs = function () {
			return crumbs;
		};

		this.clear = function () {
			crumbs = this.init();
		};

		this.init = function () {
			return [{
				state: 'profile.home',
				label: 'Home'
			}];
		};

		var crumbs = this.init();
	}

	/**
	 * Service for meta title and meta description etc.
	 * @type {string[]}
	 */
	SeoService.$inject = ['$rootScope', 'BreadCrumbsService'];
	function SeoService($rootScope, BreadCrumbsService) {
		/**
		 * Get title for html
		 * @returns {string}
		 */
		this.getTitle = function () {
			return _.last(BreadCrumbsService.getCrumbs()).label + ' - ' + Lang.get('constants.company_name_snake');
		};

		///**
		// * Add title separator
		// * @returns {string}
		// */
		//this.getTitleSeparator = function() {
		//	return ' - TenantCloud';
		//};

	}

	/**
	 * Service for Cordova App
	 * @type {string[]}
	 */
	CordovaService.$inject = ['$rootScope', '$window', 'CONFIG', 'AuthDataService', '$http','$state'];
	function CordovaService($rootScope, $window, CONFIG, AuthDataService, $http, $state) {

		var deviceInited = false;

		this.init = function () {

			var self = this;

			if(!this.isCordova()) return;

			$rootScope.isCordovaApp = true;

			// Status Bar
			self.initStatusBar();
			self.initKeyboard();
		};

		/**
		 * Is cordova app
		 * @returns {boolean}
         */
		this.isCordova = function () {
			return !!$window.cordova;
		};

		this.initDevice = function () {

			var self = this;

			if(deviceInited) {
				return false;
			}
			if(!this.isCordova()) {
				return false;
			}
			if(typeof device !== 'object') {
				return false;
			}

			if(!localStorage.getItem('leagues-jwt-token')) {
				return false;
			}

			var deviceHeader = this.getDeviceHeaderValue();

			$http.put( CONFIG.host + '/api/profile/device', device, {
				withCredentials: true,
				headers: {
					'Authorization': AuthDataService.getToken(),
					'Device': deviceHeader
				}
			}).success(function (resp) {
				deviceInited = true;

				// Init pushes
				self.initPushNotifications();
			});
		};

		this.getDeviceHeaderValue = function () {
			if(!this.isCordova()) {
				return false;
			}
			if(typeof device !== 'object') {
				return false;
			}
			return [device.platform, device.uuid].join(' ');
		};

		/**
		 *
		 */
		this.initStatusBar = function() {
			if(typeof StatusBar !== 'object') return;

			// Fix Android, StatusBar not working
			if (cordova.platformId === 'android') {
				StatusBar.hide();
			} else {
				this.setStatusBarColor();
			}
		};

		/**
		 * @returns {string}
		 */
		this.setStatusBarColor = function () {

			if(!this.isCordova()) return false;
			if(typeof StatusBar !== 'object') return false;

			StatusBar.overlaysWebView(false);

			var skin = $rootScope.auth && $rootScope.auth.skin ? $rootScope.auth.skin : null;
			var skin_border = $rootScope.auth && $rootScope.auth.skin_border ? $rootScope.auth.skin_border : null;
			var hex = CONFIG.settings.skins_hex[skin] || '#12546C';
			var hex_border = CONFIG.settings.skins_hex[skin_border] || '#12546C';
			StatusBar.backgroundColorByHexString(hex);
			StatusBar.backgroundColorByHexString(hex_border);
		};

		this.spinnerDialogShow = function () {
			if(!this.isCordova()) return false;
			if(typeof window.plugins !== 'object' && typeof window.plugins.spinnerDialog !== 'object') return false;
        
			window.plugins.spinnerDialog.show();
		};
        
		this.spinnerDialogHide = function () {
			if(!this.isCordova()) return false;
			if(typeof window.plugins !== 'object' && typeof window.plugins.spinnerDialog !== 'object') return false;
        
			window.plugins.spinnerDialog.hide();
		};

		this.initKeyboard = function () {

			if(typeof Keyboard !== 'function') return false;

			$rootScope.isKeyboardVisible = Keyboard.isVisible;

			window.addEventListener('keyboardWillShow', function (e) {
				//e.keyboardHeight
				$rootScope.$evalAsync(function () {
					$rootScope.isKeyboardVisible = true;
				});
			});
			window.addEventListener('keyboardWillHide', function (e) {
				//angular.element('body .main-header').css('top', '20px');
				// Fix for StatusBar
				StatusBar.hide();
				if (cordova.platformId !== 'android') {
					StatusBar.show();
				}
				// StatusBar.overlaysWebView(true);
				// StatusBar.overlaysWebView(false);

				$rootScope.$evalAsync(function () {
					$rootScope.isKeyboardVisible = false;
				});
			});
		};



		this.initPushNotifications = function (push_token) {

			if(typeof PushNotification !== 'object') return false;
			var self = this;

			var push = PushNotification.init({
				android: {
					senderID: CONFIG.push.gcm.senderID,
					icon: 'icon'
				},
				ios: {
					alert: "true",
					badge: "true",
					sound: "true",
					clearBadge: "true"
					// senderID: CONFIG.push.gcm.senderID,
					// gcmSandbox: CONFIG.push.gcm.sandbox
				}
			});

			// PushNotification.hasPermission(function (permissionResult) {
			// 	if (permissionResult.isEnabled) {
			// 		push.on('registration', function (registrationResult) {
			// 			console.log(registrationResult.registrationId);
			// 		});
			// 		push.on('error', function (error) {
			// 			console.log('push notification error', error);
			// 		});
			// 	}
			// });

			push.on('registration', function (registrationResult) {
				var obj = _.extend(_.clone(device), { token: registrationResult.registrationId });
				$http.put( CONFIG.host + '/api/profile/push_register', obj, {
					withCredentials: true,
					headers: {
						'Authorization': AuthDataService.getToken(),
						'Device': self.getDeviceHeaderValue()
					}
				});
			});

			push.on('notification', function(pushData) {
				if(navigator.notification && typeof navigator.notification === 'object') {
					navigator.notification.alert(
						pushData.message,  // message
						null,         // callback
						pushData.title,            // title
						'Close'                  // buttonName
					);
				} else {
					alert(pushData.title + '. ' + pushData.message);
				}
					var self = this,
						payload;

					if(!pushData.additionalData.data) {
						return false;
					}
					payload = pushData.additionalData.data;
						switch (payload.action) {
							case 'App\\Events\\Profile\\MessageWasSent':
								$state.go('profile.messages');
								break;
							case 'App\\Events\\Profile\\PaymentWasReceived':
								$state.go('profile.transactions');
								break;
							case 'App\\Events\\League\\BoardMessageWasSent':
								$state.go('leagues.board', {id: payload.leagueId});
								break;

							case 'App\\Events\\League\\OwnerWasJoined':
								$state.go('leagues.owners', {id: payload.leagueId});
								break;
							case 'App\\Events\\League\\TransactionWasConfirmed':
								$state.go('leagues.transactions', {id: payload.leagueId});
								break;
							case 'App\\Events\\League\\TransactionWasCreated':
								$state.go('leagues.transactions', {id: payload.leagueId});
								break;
							case 'App\\Events\\League\\TransactionWasDenied':
								$state.go('leagues.transactions', {id: payload.leagueId});
								break;
						}

			});

			push.on('error', function(e) {
				console.log("PUSH ERROR: " + e.message);
			});

			// push.unregister(function (resp) {
			// 	console.log(resp);
			// }, function (resp) {
			// 	console.log(resp);
			// });
		};

	}

})();
