(function () {

	'use strict';

	// For templates
	angular
		.module('app.templates', [])
	;

	angular
		.module('app', [
			'ui.router',
			'ui.select',
			'angucomplete-alt',
			'ngSanitize',
			'ngDialog',
			'ngAnimate',
			'angularFileUpload',
			'ngFileUpload',
			'LocalStorageModule',
			'angular-loading-bar', //loading-bar
			// 'angular-loading-bar-cordova',
			'ngCkeditor',
			'summernote',
			'ui.timepicker',
			'ui.bootstrap.datetimepicker',
			'ui.dateTimeInput',

			// tpl
			'app.templates',

			//Components
			'app.factories',
			'app.filters',
			'app.services',
			'app.utils',
			'app.notify',
			'app.paging',

			//Directives
			'app.directivesForm',
			'app.directives_main',
			'app.directives_form',
			'app.layout_partials',
			'app.helper',

			'app.auth',
			'app.profile',
			'app.news',
			'app.games',
			'app.boxes',
			'app.leagues',
			'app.leagues_news',
			'app.leagues_events'
		])

		.config(configure)

		.run(runBlock)
	;

	/* Fn
	 ============================================================================================================ */
	configure.$inject = ['$locationProvider', '$urlRouterProvider', '$httpProvider', '$animateProvider', 'cfpLoadingBarProvider'];
	function configure($locationProvider, $urlRouterProvider, $httpProvider, $animateProvider, cfpLoadingBarProvider) {

		if(!!window.cordova) {
			$locationProvider.html5Mode({
				enabled: false,
				requireBase: false
			});
		} else {
			$locationProvider.html5Mode({
				enabled: true,
				requireBase: false
			});
		}

		//if(!!window.cordova && typeof window.plugins === 'object') {
		// 	cfpLoadingBarProvider.includeBar = false;
		// 	cfpLoadingBarProvider.includeSpinner = false;
		// 	cfpLoadingBarProvider.latencyThreshold = 100;
		// } else {
			cfpLoadingBarProvider.includeBar = false;
			cfpLoadingBarProvider.latencyThreshold = 0;
		// }

		$animateProvider.classNameFilter(/nganimation/);

		$urlRouterProvider.otherwise("/dashboard");
		$httpProvider.defaults.useXDomain = true;
		$httpProvider.interceptors.push('authInterceptor');
		$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
		$httpProvider.defaults.useXDomain = true;

		delete $httpProvider.defaults.headers.common['X-Requested-With'];

	}

	runBlock.$inject = ['$rootScope', '$location', '$state', 'ngDialog', 'BreadCrumbsService', 'SeoService', '$timeout', 'AUTH', 'CONFIG', '$window', 'ng_util', 'AuthDataService', 'CordovaService'];
	function runBlock($rootScope, $location, $state, ngDialog, BreadCrumbsService, SeoService, $timeout, AUTH, CONFIG, $window, ng_util, AuthDataService, CordovaService) {
		Lang.setMessages(CONFIG.trans); //set messages object
		//Currently logged user info
		$rootScope.auth = AUTH.user;

		if(AUTH.user) {

			// // check for role
			// if($rootScope.auth.is_admin) {
			// 	AuthDataService.clearAuthData();
			// 	$window.location.href = '/admin';
			// 	return false;
			// }

			if( $location.path().indexOf('dashboard') === -1 ) {
				$location.path('/dashboard');
			}

			// Cordova status bar change
			CordovaService.setStatusBarColor();
			CordovaService.initDevice();

		} else {
			// Redirect to login
			if( ['/registration', '/reset_password', '/reset_password_confirm', '/login'].indexOf($location.path()) === -1 ) {
				$location.path('/login');
			}
		}
		var w = angular.element($window);
		$rootScope.$watch(
			function () {
				return $window.innerHeight;
			},
			function (value) {
				$rootScope.innerHeight = value - 140;
			},
			true
		);

		w.bind('resize', function(){
			$rootScope.$apply();
		});
		// fix navbar
		window.addEventListener('resize', function () {
			var initialWidth = $window.innerWidth;

			if(initialWidth >= 991) {
				ng_util.safeApply($rootScope ,function(){
					$rootScope.isCollapseSidebar = false;

					var sidebar = document.getElementsByClassName('main-sidebar')[0];
					$(sidebar).removeClass('collapse');
				});
			}
		});

		// State events
		$rootScope.$on('$stateChangeStart', function (event, next, current) {
			BreadCrumbsService.clear();
			$rootScope.isCollapseSidebar = false;

			$rootScope.state = $state;

			// Close all dialogs
			ngDialog.closeAll();
		});
		$rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
			console.log('Resolve Error: ', error);
		});
		$rootScope.$on('$stateChangeSuccess', function (event, to, toParams, from, fromParams) {
			$rootScope.breadCrumbs = BreadCrumbsService.getCrumbs();

			//if($rootScope.auth && !$rootScope.auth.is_active && $location.path() !== '/logout') {
			//	$timeout(function () {
			//		$location.path('/dashboard/profile/edit', _.clone($location.search()));
			//	})
			//}

			$(window).scrollTop(0);
		});

		// For SEO
		$rootScope.getSeoTitle = SeoService.getTitle;
		$rootScope.getSeoDescription = SeoService.getDescription;

		// State, maybe remove form this (use in $stateChangeStart)
		$rootScope.state = $state;

		$rootScope.location = $location;

		//Init Underscore in template
		$rootScope._ = _;

		// Back button
		$rootScope.$back = function () {
			if (window.history.length > 2) {
				window.history.back();
			} else {
				$state.transitionTo('profile.home');
			}
		};

		$rootScope.isEmptyObject = function (object) {
			return !object || _.isEmpty(object);
		};

		// Check if dashboard
		$rootScope.isDashboard = function () {
			return $location.path().indexOf('dashboard') !== -1;
		};

		// Init Cordova
		CordovaService.init();

		// USER
		$rootScope.getUserSkin = function () {
			return $rootScope.auth ? 'skin-' + $rootScope.auth.skin : 'skin-blue-gray';
		};
		$rootScope.getUserBorderSkin = function () {
			return $rootScope.auth ? 'skin-border-' + $rootScope.auth.skin_border : 'skin-border-blue';
		};

		// USER can
		$rootScope.can = {};
		$rootScope.can = $rootScope.can || {};
		$rootScope.can.leagueEdit = function (league) {
			if(!league.id) return true;
			return $rootScope.auth.id === league.author.user_id;
		};


	}

})();
