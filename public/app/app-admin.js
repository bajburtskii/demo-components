(function () {

	'use strict';

	// For templates
	angular
		.module('app.templates', [])
	;

	angular
		.module('app', [
			'ui.router',
			'ngSanitize',
			'ngDialog',
			'ngAnimate',
			'angularFileUpload',
			'LocalStorageModule',
			'angular-loading-bar', //loading-bar
			'ngCkeditor',

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
			'app.directives_main',
			'app.directives_form',
			'app.layout_partials',
			'app.helper',

			'app.auth',
			'app.admin',
			'app.pages',
			'app.boxes',
			'app.boxes_categories',
			'app.users',
			'app.subscribers',
			'app.settings',
			'app.questions'
		])

		.config(configure)

		.run(runBlock)
	;

	/* Fn
	 ============================================================================================================ */
	configure.$inject = ['$locationProvider', '$urlRouterProvider', '$httpProvider', '$animateProvider', 'cfpLoadingBarProvider'];
	function configure($locationProvider, $urlRouterProvider, $httpProvider, $animateProvider, cfpLoadingBarProvider) {

		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});

		cfpLoadingBarProvider.includeBar = false;
		cfpLoadingBarProvider.latencyThreshold = 0;

		$animateProvider.classNameFilter(/nganimation/);

		$urlRouterProvider.otherwise("/admin");
		$httpProvider.defaults.useXDomain = true;
		$httpProvider.interceptors.push('authInterceptor');
		$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
		$httpProvider.defaults.useXDomain = true;

		delete $httpProvider.defaults.headers.common['X-Requested-With'];

	}

	runBlock.$inject = ['$rootScope', '$location', '$state', '$timeout', '$window', 'ngDialog', 'BreadCrumbsService', 'SeoService', 'AUTH', 'CONFIG', 'ng_util', 'CordovaService'];
	function runBlock($rootScope, $location, $state, $timeout, $window, ngDialog, BreadCrumbsService, SeoService, AUTH, CONFIG, ng_util, CordovaService) {
		Lang.setMessages(CONFIG.trans); //set messages object
		//Currently logged user info
		$rootScope.auth = AUTH.user;

		if(!AUTH.user) {
			if( $location.path().indexOf('admin') === -1 ) {
				$location.path('/admin');
			}
		} else {
			CordovaService.initDevice();
		}

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
		// State events
		$rootScope.$on('$stateChangeStart', function (event, next, current) {
			BreadCrumbsService.clear();
			$rootScope.isCollapseSidebar = false;

			$rootScope.state = $state;

			if(!$rootScope.auth || !$rootScope.auth.is_admin) {
				$timeout(function () {
					$state.go('auth.login');
				});
			}

			// Close all dialogs
			ngDialog.closeAll();
		});
		$rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
			console.log('Resolve Error: ', error);
		});
		$rootScope.$on('$stateChangeSuccess', function (event, to, toParams, from, fromParams) {
			$rootScope.breadCrumbs = BreadCrumbsService.getCrumbs();
			$(window).scrollTop(0);
		});

		// For SEO
		$rootScope.getSeoTitle = SeoService.getTitle;
		$rootScope.getSeoDescription = SeoService.getDescription;

		// State, maybe remove form this (use in $stateChangeStart)
		$rootScope.state = $state;

		$rootScope.location = $location;

		//TODO Maybe rewrite it like module. Not global initialization
		//Init Underscore in template
		$rootScope._ = _;

		// Back button
		$rootScope.$back = function () {
			if (window.history.length > 2) {
				window.history.back();
			} else {
				$state.transitionTo('admin.main');
			}
		};

		$rootScope.isEmptyObject = function (object) {
			return !object || _.isEmpty(object);
		};

		// Check if dashboard
		$rootScope.isDashboard = function () {
			return $location.path().indexOf('/admin/') !== -1;
		};

		$rootScope.isCordovaApp = !!window.cordova;

		// USER
		$rootScope.getUserSkin = function () {
			return $rootScope.auth ? 'skin-' + $rootScope.auth.skin : 'skin-blue-gray';
		};
		$rootScope.getUserBorderSkin = function () {
			return $rootScope.auth ? 'skin-border-' + $rootScope.auth.skin_border : 'skin-border-blue';
		};

	}

})();
