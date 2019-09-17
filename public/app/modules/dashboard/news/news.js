(function () {
    'use strict';

    angular
        .module('app.news', [])

        .config(configure)
        .controller('NewsCtrl.list', NewsCtrl_List)
        .controller('NewsCtrl.sidebar', NewsCtrl_Sidebar)
    ;

    /* Fn
     ============================================================================================================= */
    configure.$inject = ['$stateProvider'];
    function configure($stateProvider) {

        $stateProvider
            .state('news', {
                abstract   : true,
                url        : '/dashboard/news',
                views : {
                    '' : {
                        templateUrl: '/app/modules/dashboard/layout.html'
                    }
                }
            })
            .state('news.list', {
                url  : '/:alias',
                views: {
                    content: {
                        controller : 'NewsCtrl.list',
                        templateUrl: '/app/modules/dashboard/news/list.html'
                    },
                    'sidebar' : {
                        controller: 'NewsCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/news/sidebar.html'
                    }
                },
                resolve: {
                    items : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/news/' + $stateParams.alias);
                    }]
                }
            })
        ;
    }

    NewsCtrl_List.$inject = ['$rootScope', '$scope', 'items', 'BreadCrumbsService', 'HttpService'];
    function NewsCtrl_List($rootScope, $scope, items, BreadCrumbsService, HttpService) {
        $scope.items = items.data.data;
        BreadCrumbsService.addCrumb(Lang.get('titles.news'));

        HttpService.get('/api/profile', function (resp)
        {
            $rootScope.auth = resp;
        });
    }

    NewsCtrl_Sidebar.$inject = ['$scope'];
    function NewsCtrl_Sidebar($scope) {
        $scope.navItems = [
            //{ alias: 'espn', title: 'Espn.com' },
            //{ alias: 'nba', title: 'NBA.com' },
            //{ alias: 'foxSports', title: 'FoxSports.com' },
            //{ alias: 'cbsSports', title: 'CBSSports.com' },
            //{ alias: 'mlb', title: 'MLB.com' },
            //{ alias: 'nfl', title: 'NFL.com' },
            //{ alias: 'yahooNba', title: 'Yahoo NBA RSS' },
            //{ alias: 'yahooMlb', title: 'Yahoo MLB RSS' },
            //{ alias: 'yahooNfl', title: 'Yahoo NFL RSS' },
            //{ alias: 'yahooNhl', title: 'yahoo NHL RSS' },
            { alias: 'playerlineNba', title: 'Playerline NBA RSS' },
            { alias: 'playerlineMlb', title: 'Playerline MLB RSS' },
            { alias: 'playerlineNfl', title: 'Playerline NFL RSS' },
            { alias: 'playerlineNhl', title: 'Playerline NHL RSS' }
        ];
    }

})();
